from django.db import models


class Gallery(models.Model):
    """
    Represents a portfolio entry — a wedding story or service collection.
    Images are stored as URLs (e.g., Supabase Storage URLs).
    """

    title = models.CharField(max_length=200)
    tag = models.CharField(max_length=50, blank=True, default="")
    image_url = models.URLField(max_length=500)
    description = models.TextField(blank=True, default="")
    is_featured = models.BooleanField(default=False)
    recommendations = models.ManyToManyField("self", blank=True, symmetrical=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "galleries"

    def __str__(self):
        return self.title


class ContactEnquiry(models.Model):
    """
    Stores enquiries submitted through the Contact page form.
    """

    STATUS_CHOICES = [
        ("new", "New"),
        ("read", "Read"),
        ("replied", "Replied"),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, default="")
    event_type = models.CharField(max_length=100, blank=True, default="")
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "contact enquiries"

    def __str__(self):
        return f"{self.name} — {self.email} ({self.created_at.strftime('%d %b %Y')})"
