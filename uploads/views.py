from django.contrib.auth import authenticate
from django.shortcuts import render
from rest_framework.parsers import FileUploadParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainSerializer, TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenViewBase

from .forms import UploadForm
from django.http import JsonResponse

# Create your views here.
from .serializers import FileSerializer


def home_view(request):
    form = UploadForm(request.POST or None, request.FILES or None)
    if request.is_ajax():
        if form.is_valid():
            form.save()
            return JsonResponse({'message': 'hell yeah'})
    context = {
        'form': form,
    }
    return render(request, 'uploads/main.html', context)


class UploadAPIView(APIView):
    permission_classes = (IsAuthenticated, )
    authentication_classes = (JWTAuthentication, )
    # parser_classes = (FileUploadParser, )

    def post(self, request):
        print(request.data)
        file_serializer = FileSerializer(data=request.data)

        if request.is_ajax():
            if file_serializer.is_valid():
                file_serializer.save()

            return Response({'message': 'hell yeah'})

        return Response({'message': 'not valid'})


class GetToken(TokenViewBase):
    token_serializer_class = TokenObtainPairSerializer
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', 'invento')
        password = request.data.get('password', 'invento123')

        user = authenticate(username=username, password=password)

        if user:
            token = self.token_serializer_class().get_token(user)

            data = {
                'token': str(token.access_token)
            }

            return Response(data)
