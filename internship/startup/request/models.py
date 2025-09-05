"""
Request model for any service requested from
given user and optionally an organization,
with a message and the service.
"""
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from django.db import models
from django.conf import settings
from uuid import uuid4
from datetime import timedelta

class RequestManager(models.Manager):
    pass

class Request(models.Model):
    """
    Request Model
    id: PK
    user: OneToMany (Foreign)
    organization: (opt.) OneToMany (Foreign)
    service: OneToMany (Foreign)
    message: Request.message (comes from 'startup_message' model)
    """

    id = models.UUIDField(
        db_index=True,
        unique=True,
        default=uuid4, # Default primarykey is UUID
        editable=False
    )

    user = models.ForeignKey(
        to=settings.DEFAULT_AUTH_USER,
        on_delete=models.CASCADE
    )

    organization = models.ForeignKey(
        to="startup_organization",
        on_delete=models.SET_NULL,
        blank=True,    # Optional field
        null=True
    )

    service = models.ForeignKey(
        to="startup_service",
        on_delete=models.CASCADE,
    )

    created_at = models.DateTimeField(
        auto_now=True,
        verbose_name="requested_at"
    )

    objects = RequestManager()

    class Meta:
        db_table = "statup_request"
        ordering = ["-created_at"]
        verbose_name_plural = "Requests"

    @property
    def get_message(self):
        """A bit redundancy"""
        try:
            return self.message
        except ObjectDoesNotExist:
            return None

    @property
    def is_requested_new(self):
        """Check if the request made in 1 day.
        Also for showcase of .is_pending_for() usage
        """
        return self.is_pending_for(
            seconds=1,
            minutes=1,
            hours=1,
            days=1,
            weeks=0,
            months=0,
            years=0
        )

    @property
    def is_pending_for_too_long(self) -> bool:
        """Check if the request pending more than 30 days."""
        return self.is_pending_for(days=30)

    def is_pending_for(self, **kwargs: int) -> bool:
        """Check if the request has been pending longer than the given time."""
        timedelta_keys = {"weeks", "days", "hours", "minutes", "seconds"}

        delta_args = {k: v for k, v in kwargs.items() if k in timedelta_keys}
        more_args = {k: v for k, v in kwargs.items() if k in {"years", "months"}}

        if not delta_args and not more_args:
            raise ValueError(
                f"No valid time keys provided. Allowed keys: {', '.join(timedelta_keys.union({'years', 'months'}))}"
            )

        years = more_args.get("years", 0)
        months = more_args.get("months", 0)
        if years or months:
            added_days = years * 365 + months * 30
            delta_args["days"] = delta_args.get("days", 0) + added_days

        return (timezone.now() - self.created_at) > timedelta(**delta_args)
