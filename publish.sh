#!/bin/bash
IMAGE_ORG=lilbunnyrabbit
IMAGE_NAME=lilbot
IMAGE_VERSION=$1

IMAGE="$IMAGE_NAME:$IMAGE_VERSION"

if [ -z "$1" ]
then
    echo "Input version"
else
    docker build --tag $IMAGE .
    docker tag $IMAGE $IMAGE_ORG/$IMAGE
    docker push $IMAGE_ORG/$IMAGE
fi