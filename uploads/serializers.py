from rest_framework import serializers

from uploads.models import Upload


class FileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Upload
        fields = ('image',)