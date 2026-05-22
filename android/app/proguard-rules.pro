# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# App
-keep class com.tooncraftpro.** { *; }

# React Native Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Linear Gradient
-keep class com.BV.LinearGradient.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }

# RevenueCat
-keep class com.revenuecat.purchases.** { *; }

# Video
-keep class com.brentvatne.react.** { *; }

# Image Picker
-keep class com.imagepicker.** { *; }

# Keep native methods
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Kotlin
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings { <fields>; }

# General
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-dontwarn java.nio.file.*
-dontwarn org.codehaus.mojo.**
