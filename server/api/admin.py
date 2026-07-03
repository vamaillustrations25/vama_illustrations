from django.contrib import admin
from .models import Gallery, ContactEnquiry


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ("title", "tag", "is_featured", "created_at")
    list_filter = ("tag", "is_featured")
    search_fields = ("title", "description")
    list_editable = ("is_featured",)
    ordering = ("-created_at",)


@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "event_type", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("name", "email", "message")
    list_editable = ("status",)
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
