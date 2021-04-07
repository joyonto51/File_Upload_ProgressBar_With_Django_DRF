from django.db import models


class Upload(models.Model):
    image = models.FileField(upload_to='files')

    def __str__(self):
        return str(self.pk)
