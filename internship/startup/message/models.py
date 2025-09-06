"""
Message model for any-type of request or subject
related to the content,
matched with person's first_name, e_mail
Related object: Request
"""
from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.http.response import Http404
from uuid import uuid4

class MessageManager(models.Manager):
    def get_object_by_id(self, id):
        try:
            instance = self.get(id=id)
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            return Http404

class Message(models.Model):
    """
    Message model
    id: PK
    first_name: CharField
    last_name: CharField
    email: EmailField
    subject: CharField
    content: TextField
    related_request: OneToOneModel
    """

    id = models.UUIDField(
        db_index=True,
        unique=True,
        default=uuid4, # Default primarykey is UUID
        editable=False
    )

    first_name = models.CharField(
        max_length=32   # Ideal for most common names
    )

    last_name = models.CharField(
        max_length=32,
        blank=True,
    )

    email = models.EmailField()

    subject = models.TextField(
        max_length=512
    )

    content = models.TextField(
        max_length=4096
    )

    related_request = models.OneToOneField(
        to="startup_request.Request",
        on_delete=models.CASCADE,
        related_name="message"
    )

    created_at = models.DateTimeField(auto_now=True)

    objects = MessageManager()

    class Meta:
        db_table = "startup_message"
        ordering = ['-created_at']
        verbose_name_plural = "Messages"
