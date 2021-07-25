#!/bin/bash
declare -a simulators=("DD628CCA-1E3D-430E-B648-137FD1AF808D", "3C8B957F-BD56-4EFD-8BF6-4440E38E5F9C")

for i in "${simulators[@]}"
do
    xcrun instruments -w $i
    #xcrun simctl install $i ~/.expo/ios-simulator-app-cache/Exponent-2.14.0.app
    xcrun simctl openurl $i exp://127.0.0.1:19000      
done

#https://stackoverflow.com/questions/53924934/can-i-run-my-expo-app-on-multiple-ios-simulators-at-once