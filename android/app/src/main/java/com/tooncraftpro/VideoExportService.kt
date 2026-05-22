package com.tooncraftpro

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class VideoExportService : Service() {

    companion object {
        const val CHANNEL_ID = "ToonCraftExportChannel"
        const val NOTIFICATION_ID = 1001
        const val ACTION_START_EXPORT = "com.tooncraftpro.START_EXPORT"
        const val ACTION_STOP_EXPORT = "com.tooncraftpro.STOP_EXPORT"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START_EXPORT -> startForegroundExport()
            ACTION_STOP_EXPORT -> stopSelf()
        }
        return START_NOT_STICKY
    }

    private fun startForegroundExport() {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("ToonCraft Pro")
            .setContentText("Exporting your cartoon video...")
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setProgress(100, 0, true)
            .setOngoing(true)
            .build()
        startForeground(NOTIFICATION_ID, notification)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Video Export",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows progress of cartoon video export"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
