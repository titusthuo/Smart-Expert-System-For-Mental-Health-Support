# core/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from django import forms
from django.core.files.base import ContentFile
from django.utils.html import format_html
from datetime import datetime, timedelta, time
from django.utils import timezone
import os
from .models import (
    User, Patient, Doctor, Specialty, Appointment,
    Organization, OrganizationClinic, PatientDoctorBookmark, Notification,
    Country, County, Insuarance, DoctorAvailability,
    AIChatMessage,
    Therapist, TherapistReview,
)

# Optional: cleaner sidebar - remove Groups
admin.site.unregister(Group)

try:
    admin.site.unregister(Doctor)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(DoctorAvailability)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(Appointment)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(Organization)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(OrganizationClinic)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(PatientDoctorBookmark)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(Notification)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(Country)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(County)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(Insuarance)
except admin.sites.NotRegistered:
    pass


# ====================== USER ADMIN ======================
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'phone_number', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'is_superuser')
    search_fields = ('email', 'phone_number', 'first_name', 'last_name')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'fields': ('email', 'phone_number', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )


# ====================== PATIENT ADMIN WITH SAFE FILE UPLOAD ======================
class PatientAdminForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = '__all__'

    def clean_profile_picture(self):
        file = self.cleaned_data.get('profile_picture')
        if not file:
            return file
        if hasattr(file, 'read') and hasattr(file, 'name'):
            try:
                content = file.read()
                file_name = os.path.basename(file.name)
                safe_file = ContentFile(content, name=file_name)
                return safe_file
            except Exception:
                pass
        return file


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    form = PatientAdminForm
    list_display = ('user', 'first_name', 'last_name', 'date_of_birth', 'gender', 'country', 'county', 'preview_photo')
    search_fields = ('user__email', 'user__phone_number', 'first_name', 'last_name')
    list_filter = ('gender', 'date_of_birth', 'country')
    raw_id_fields = ('user',)

    def preview_photo(self, obj):
        if obj.profile_picture:
            return format_html(
                '<img src="{}" width="40" height="40" style="border-radius:50%; object-fit:cover;" />',
                obj.profile_picture.url
            )
        return "(No photo)"
    preview_photo.short_description = "Photo"


# ====================== DOCTOR ADMIN ======================
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = (
        'full_name',
        'get_email',                    # Method defined below
        'primary_specialty',
        'takes_prepaid_payment',
        'teleconsult_price'
    )
    list_filter = ('primary_specialty', 'takes_prepaid_payment', 'takes_postpaid_payment')
    search_fields = ('user__email', 'first_name', 'last_name', 'full_name')
    raw_id_fields = ('user', 'primary_specialty')

    def get_email(self, obj):
        """Display doctor's email from linked User"""
        return obj.user.email if obj.user else '-'
    get_email.short_description = 'Email'
    get_email.admin_order_field = 'user__email'  # Allows sorting by email


# ====================== DOCTOR AVAILABILITY ADMIN (WITH ADVANCED BOOKED STATUS) ======================
@admin.register(DoctorAvailability)
class DoctorAvailabilityAdmin(admin.ModelAdmin):
    list_display = (
        'doctor',
        'is_recurring',
        'recurrence_day_of_week',
        'start_time_of_day',
        'end_time_of_day',
        'specific_date',
        'booked_status_display',
    )
    list_filter = ('is_recurring', 'recurrence_day_of_week', 'doctor')
    search_fields = ('doctor__full_name', 'doctor__user__email')
    date_hierarchy = 'specific_date'
    ordering = ('-specific_date', 'recurrence_day_of_week', 'start_time_of_day')

    def booked_status_display(self, obj):
        """
        Advanced booked status for blocks:
        - One-time: simple existence check
        - Recurring: checks bookings on first/most recent occurrence day
        Returns: "All Available", "Fully Booked", or "Partially Booked (X/Y)"
        """
        if not obj.is_recurring:
            # One-time block
            if not obj.start_time or not obj.end_time:
                return "Invalid (missing times)"
            booked = Appointment.objects.filter(
                doctor=obj.doctor,
                start_time__gte=obj.start_time,
                start_time__lt=obj.end_time,
                status__in=['UPCOMING', 'ONGOING']
            ).exists()
            return "Booked" if booked else "Available"

        # Recurring block: find nearest occurrence date
        today = timezone.now().date()
        occurrence_date = obj.recurrence_end_date or today
        
        # Move forward or backward to find matching weekday
        direction = 1 if occurrence_date >= today else -1
        while occurrence_date.weekday() != obj.recurrence_day_of_week:
            occurrence_date += timedelta(days=direction)

        # Build datetime range for that day
        block_start = datetime.combine(occurrence_date, obj.start_time_of_day, tzinfo=timezone.get_current_timezone())
        block_end = datetime.combine(occurrence_date, obj.end_time_of_day, tzinfo=timezone.get_current_timezone())

        # Calculate total possible 30-min slots
        total_seconds = (block_end - block_start).total_seconds()
        total_slots = int(total_seconds / 1800)  # 30 minutes = 1800 seconds

        # Count booked (UPCOMING or ONGOING) slots in this block
        booked_count = Appointment.objects.filter(
            doctor=obj.doctor,
            start_time__gte=block_start,
            start_time__lt=block_end,
            status__in=['UPCOMING', 'ONGOING']
        ).count()

        if booked_count == 0:
            return "All Available"
        elif booked_count == total_slots:
            return "Fully Booked"
        else:
            return f"Partially Booked ({booked_count}/{total_slots})"

    booked_status_display.short_description = "Booked Status"


# ====================== APPOINTMENT ADMIN ======================
@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        'patient', 'doctor', 'start_time', 'encounter_mode',
        'cost', 'payment_completed', 'status_colored', 'rastuc_id'
    )
    list_filter = (
        'encounter_mode',
        'payment_completed',
        'status',
        'start_time',
        'doctor',
    )
    search_fields = (
        'patient__user__email',
        'patient__first_name',
        'patient__last_name',
        'doctor__user__email',
        'doctor__first_name',
        'doctor__full_name',
        'rastuc_id'
    )
    raw_id_fields = ('patient', 'doctor', 'organization', 'organization_clinic')
    date_hierarchy = 'start_time'
    ordering = ('-start_time',)

    def status_colored(self, obj):
        colors = {
            'UPCOMING': '#1976d2',   # blue
            'ONGOING': '#ff9800',     # orange
            'COMPLETED': '#4caf50',   # green
            'CANCELLED': '#9e9e9e',   # gray
        }
        color = colors.get(obj.status, '#757575')
        return format_html(
            '<span style="color:{}; font-weight:bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_colored.short_description = "Status"
    status_colored.admin_order_field = 'status'


# ====================== THERAPIST DIRECTORY ADMIN ======================
@admin.register(Therapist)
class TherapistAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'county',
        'town',
        'phone',
        'email',
        'license_number',
        'price',
        'availability',
    )
    search_fields = ('name', 'county', 'town', 'phone', 'email', 'license_number')
    list_filter = ('county', 'town', 'specialization')
    filter_horizontal = ('specialization',)


@admin.register(TherapistReview)
class TherapistReviewAdmin(admin.ModelAdmin):
    list_display = ('therapist', 'author', 'rating', 'date')
    search_fields = ('therapist__name', 'author', 'comment')
    list_filter = ('rating', 'date')


# ====================== AI CHAT MESSAGE ADMIN ======================
@admin.register(AIChatMessage)
class AIChatMessageAdmin(admin.ModelAdmin):
    list_display = ('patient', 'sender_display', 'short_text', 'created_at')
    list_filter = ('is_from_user', 'created_at', 'patient')
    search_fields = (
        'patient__user__email',
        'patient__first_name',
        'patient__last_name',
        'text',
    )
    readonly_fields = ('created_at',)
    raw_id_fields = ('patient',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

    def sender_display(self, obj):
        if obj.is_from_user:
            return format_html('<strong style="color:#1976d2;">{}</strong>', 'Patient')
        return format_html('<strong style="color:#43a047;">{}</strong>', 'AI Assistant')
    sender_display.short_description = "Sender"
    sender_display.admin_order_field = 'is_from_user'

    def short_text(self, obj):
        text = obj.text.strip()
        if len(text) > 80:
            return text[:77] + "..."
        return text
    short_text.short_description = "Message"


# ====================== OTHER SIMPLE ADMINS ======================
@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Insuarance)
class InsuaranceAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'type')
    search_fields = ('name', 'type')


@admin.register(OrganizationClinic)
class OrganizationClinicAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization')
    search_fields = ('name', 'organization__name')
    raw_id_fields = ('organization',)


@admin.register(PatientDoctorBookmark)
class PatientDoctorBookmarkAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'created_at')
    list_filter = ('created_at',)
    raw_id_fields = ('patient', 'doctor')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('patient', 'title', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('patient__user__email', 'title', 'description')
    readonly_fields = ('created_at',)
    raw_id_fields = ('patient',)


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')
    ordering = ('name',)


@admin.register(County)
class CountyAdmin(admin.ModelAdmin):
    list_display = ('name', 'country')
    search_fields = ('name', 'country__name')
    list_filter = ('country',)
    raw_id_fields = ('country',)
    ordering = ('country__name', 'name')


# Hide non-therapist models from the admin UI (frontend doesn't use them).
for _model in [
    Doctor,
    DoctorAvailability,
    Appointment,
    Organization,
    OrganizationClinic,
    PatientDoctorBookmark,
    Notification,
    Country,
    County,
    AIChatMessage,
    Insuarance,
]:
    try:
        admin.site.unregister(_model)
    except admin.sites.NotRegistered:
        pass