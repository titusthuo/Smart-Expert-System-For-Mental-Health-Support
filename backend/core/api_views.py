# core/api_views.py
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status


from django.views.decorators.csrf import csrf_exempt   # ← ADD THIS

class UploadProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @method_decorator(csrf_exempt)   # ← ADD THIS LINE
    def post(self, request):
        if 'profile_picture' not in request.FILES:
            return Response({"error": "No image provided"}, status=400)

        patient = request.user.patient
        patient.profile_picture = request.FILES['profile_picture']
        patient.save()

        photo_url = request.build_absolute_uri(patient.profile_picture.url)

        return Response({
            "success": True,
            "profile_picture_url": photo_url
        })


class GetProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]

    @method_decorator(csrf_exempt)
    def get(self, request):
        try:
            patient = request.user.patient
            if patient.profile_picture:
                return Response({"profile_picture_url": request.build_absolute_uri(patient.profile_picture.url)})
            return Response({"profile_picture_url": None})
        except:
            return Response({"profile_picture_url": None})