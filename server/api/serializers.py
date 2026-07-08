from rest_framework import serializers
from .models import Gallery, ContactEnquiry


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = [
            "id",
            "title",
            "tag",
            "image_url",
            "description",
            "is_featured",
            "recommendations",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ContactEnquirySerializer(serializers.ModelSerializer):
    """
    Write: accepts name, email, phone, services_required, message.
    Read:  returns all fields including status and created_at (admin use).
    """
    phone = serializers.CharField(required=True, allow_blank=False)
    services_required = serializers.CharField(required=True, allow_blank=False)

    class Meta:
        model = ContactEnquiry
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "services_required",
            "message",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_email(self, value):
        return value.lower().strip()

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        return value.strip()

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        return value.strip()
