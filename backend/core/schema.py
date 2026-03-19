# core/schema.py
import graphene
from graphene_django import DjangoObjectType
import graphql_jwt
from graphql_jwt.decorators import login_required
from graphql_jwt.shortcuts import get_token
from datetime import timedelta, datetime, time, date
from django.contrib.auth import authenticate
from django.db import models
from django.utils import timezone
from decimal import Decimal
from django.core.exceptions import ValidationError
import uuid
from graphene_file_upload.scalars import Upload

# Import channels only if available (for notifications)
try:
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync
    CHANNELS_AVAILABLE = True
except ImportError:
    CHANNELS_AVAILABLE = False

from .models import (
    User, Country, County, Notification, Insuarance, 
    AIChatMessage, Therapist, TherapistReview,
)


class CoordsType(graphene.ObjectType):
    lat = graphene.Float()
    lng = graphene.Float()

class CountryType(DjangoObjectType):
    class Meta:
        model = Country
        fields = ("id", "name", "code")


class CountyType(DjangoObjectType):
    class Meta:
        model = County
        fields = ("id", "name", "country")




class TherapistReviewType(DjangoObjectType):
    class Meta:
        model = TherapistReview
        fields = ("id", "author", "rating", "date", "comment")


class TherapistType(DjangoObjectType):
    photo_url = graphene.String()
    coords = graphene.Field(CoordsType)
    specialization = graphene.List(graphene.String)
    license_number = graphene.String()

    rating = graphene.Float()
    reviews = graphene.Int()

    reviews_list = graphene.List(TherapistReviewType)

    full_bio = graphene.String()

    class Meta:
        model = Therapist
        fields = (
            "id",
            "name",
            "location",
            "county",
            "town",
            "phone",
            "whatsapp",
            "email",
            "bio",
            "price",
            "availability",
            "experience",
            "qualifications",
        )

    def resolve_photo_url(self, info):
        if self.photo:
            return info.context.build_absolute_uri(self.photo.url)
        return None

    def resolve_coords(self, info):
        if self.lat is None or self.lng is None:
            return None
        return CoordsType(lat=self.lat, lng=self.lng)

    def resolve_specialization(self, info):
        return list(self.specialization.values_list('name', flat=True))

    def resolve_license_number(self, info):
        return self.license_number

    def resolve_full_bio(self, info):
        return self.full_bio

    def resolve_reviews(self, info):
        return self.reviews.count()

    def resolve_rating(self, info):
        agg = self.reviews.aggregate(avg=models.Avg('rating'))
        avg = agg.get('avg')
        return float(avg) if avg is not None else 0.0

    def resolve_reviews_list(self, info):
        return self.reviews.all()


class UserType(DjangoObjectType):
    name = graphene.String()
    phone = graphene.String()
    country = graphene.String()
    profile_picture_url = graphene.String()

    class Meta:
        model = User
        fields = ("id", "username", "email", "phone_number", "first_name", "last_name", "is_active")

    def resolve_name(self, info):
        full = f"{(self.first_name or '').strip()} {(self.last_name or '').strip()}".strip()
        return full or self.username

    def resolve_phone(self, info):
        return self.phone_number

    def resolve_country(self, info):
        
        if self.country:
            return self.country.name
        return None
    
    def resolve_profile_picture_url(self, info):
        if self.profile_picture:
            return info.context.build_absolute_uri(self.profile_picture.url)
        return None












class InsuaranceType(DjangoObjectType):
    logo_url = graphene.String(description="Full URL to the insurance logo")

    class Meta:
        model = Insuarance
        fields = "__all__"

    def resolve_logo_url(self, info):
        if self.logo:
            return info.context.build_absolute_uri(self.logo.url)
        return None


class NotificationType(graphene.ObjectType):
    id = graphene.Int(required=True)
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    createdAt = graphene.DateTime(required=True)
    isRead = graphene.Boolean(required=True)




class AIChatMessageType(DjangoObjectType):
    class Meta:
        model = AIChatMessage
        fields = ("id", "text", "is_from_user", "created_at")








class SignIn(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()
    user = graphene.Field(UserType)

    @staticmethod
    def mutate(root, info, username, password):
        user = authenticate(username=username, password=password)
        if not user:
            try:
                user_by_email = User.objects.get(email__iexact=username)
                user = authenticate(username=user_by_email.username, password=password)
            except User.DoesNotExist:
                pass
        if not user:
            try:
                user_by_phone = User.objects.get(phone_number=username)
                user = authenticate(username=user_by_phone.username, password=password)
            except User.DoesNotExist:
                pass
        if not user:
            raise Exception("Invalid credentials")
        token = get_token(user)
        return SignIn(token=token, user=user)


class SignUp(graphene.Mutation):
    class Arguments:
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        country = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()
    user = graphene.Field(UserType)
    success = graphene.Boolean()
    error = graphene.String()

    @staticmethod
    def mutate(root, info, first_name, last_name, username, email, country, password):
        if User.objects.filter(username__iexact=username).exists():
            return SignUp(success=False, error="Username already taken")
        if User.objects.filter(email__iexact=email).exists():
            return SignUp(success=False, error="Email already registered")
        username = username.lower().strip()
        email = email.lower().strip()
        first_name = first_name.strip()
        last_name = last_name.strip()
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(password)
        user.save()

        country_name = (country or "").strip()
        if country_name:
            resolved_country, _ = Country.objects.get_or_create(name=country_name)
            user.country = resolved_country
            user.save()

        token = get_token(user)
        return SignUp(success=True, error=None, token=token, user=user)






class UploadProfilePicture(graphene.Mutation):
    class Arguments:
        file = Upload(required=True)

    success = graphene.Boolean()
    error = graphene.String()
    user = graphene.Field(UserType)

    @staticmethod
    @login_required
    def mutate(root, info, file):
        user = info.context.user
        if not file:
            return UploadProfilePicture(success=False, error="No file provided", user=None)
        user.profile_picture = file
        user.save()
        return UploadProfilePicture(success=True, error=None, user=user)


class RemoveProfilePicture(graphene.Mutation):
    success = graphene.Boolean()
    error = graphene.String()
    user = graphene.Field(UserType)

    @staticmethod
    @login_required
    def mutate(root, info):
        user = info.context.user
        if user.profile_picture:
            user.profile_picture.delete(save=False)
            user.profile_picture = None
            user.save()
        return RemoveProfilePicture(success=True, error=None, user=user)


class UpdateProfile(graphene.Mutation):
    class Arguments:
        name = graphene.String()
        email = graphene.String()
        phone = graphene.String()

    success = graphene.Boolean()
    error = graphene.String()
    user = graphene.Field(UserType)

    @staticmethod
    @login_required
    def mutate(root, info, name=None, email=None, phone=None):
        user = info.context.user
        
        try:
            # Update name (split into first_name and last_name)
            if name is not None:
                name_parts = name.strip().split(None, 1)
                user.first_name = name_parts[0] if len(name_parts) > 0 else ""
                user.last_name = name_parts[1] if len(name_parts) > 1 else ""
            
            # Update email
            if email is not None:
                email = email.strip()
                if email:
                    # Check if email is already taken by another user
                    if User.objects.filter(email=email).exclude(id=user.id).exists():
                        return UpdateProfile(success=False, error="Email already in use", user=None)
                    user.email = email
                else:
                    user.email = None
            
            # Update phone
            if phone is not None:
                phone = phone.strip()
                if phone:
                    # Check if phone is already taken by another user
                    if User.objects.filter(phone_number=phone).exclude(id=user.id).exists():
                        return UpdateProfile(success=False, error="Phone number already in use", user=None)
                    user.phone_number = phone
                else:
                    user.phone_number = None
            
            user.save()
            return UpdateProfile(success=True, error=None, user=user)
            
        except Exception as e:
            return UpdateProfile(success=False, error=str(e), user=None)


class UploadInsuranceLogo(graphene.Mutation):
    class Arguments:
        insurance_id = graphene.Int(required=True)
        file = Upload(required=True)

    success = graphene.Boolean()
    error = graphene.String()
    insurance = graphene.Field(InsuaranceType)

    @staticmethod
    @login_required
    def mutate(root, info, insurance_id, file):
        user = info.context.user
        if not user.is_staff:
            return UploadInsuranceLogo(success=False, error="Only staff can upload insurance logos")

        try:
            insurance = Insuarance.objects.get(id=insurance_id)
        except Insuarance.DoesNotExist:
            return UploadInsuranceLogo(success=False, error="Insurance not found")

        if not file:
            return UploadInsuranceLogo(success=False, error="No file provided")

        insurance.logo = file
        insurance.save()
        return UploadInsuranceLogo(success=True, error=None, insurance=insurance)




class SendAIChatMessage(graphene.Mutation):
    class Arguments:
        text = graphene.String(required=True)
        is_from_user = graphene.Boolean(default_value=True)

    message = graphene.Field(AIChatMessageType)
    success = graphene.Boolean()
    error = graphene.String()

    @staticmethod
    @login_required
    def mutate(root, info, text, is_from_user=True):
        user = info.context.user
        if not user.is_authenticated:
            return SendAIChatMessage(success=False, error="Authentication required")
        
        text = text.strip()
        if not text:
            return SendAIChatMessage(success=False, error="Message text cannot be empty")
        
        message = AIChatMessage.objects.create(
            user=user,
            text=text,
            is_from_user=is_from_user,
        )
        return SendAIChatMessage(message=message, success=True, error=None)




class Query(graphene.ObjectType):
    hello = graphene.String(default_value="Health Backend API is LIVE!")
    me = graphene.Field(UserType)
    therapists = graphene.List(TherapistType)
    therapist = graphene.Field(TherapistType, id=graphene.Int(required=True))
    ai_chat_messages = graphene.List(AIChatMessageType)

    def resolve_me(self, info):
        return info.context.user if info.context.user.is_authenticated else None

    def resolve_therapists(self, info):
        return Therapist.objects.all()

    def resolve_therapist(self, info, id):
        try:
            return Therapist.objects.get(pk=id)
        except Therapist.DoesNotExist:
            return None

    def resolve_ai_chat_messages(self, info):
        user = info.context.user
        if not user.is_authenticated:
            return AIChatMessage.objects.none()
        return AIChatMessage.objects.filter(user=user).order_by("created_at")


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

    sign_in = SignIn.Field()
    sign_up = SignUp.Field()
    update_profile = UpdateProfile.Field()
    upload_profile_picture = UploadProfilePicture.Field()
    remove_profile_picture = RemoveProfilePicture.Field()
    send_ai_chat_message = SendAIChatMessage.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)