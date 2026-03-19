package com.privatizerapps.ultracallvault;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import org.json.JSONObject;

/**
 * JavaScript interface accessible from the web app via window.NativeBridge
 * 
 * Usage in JavaScript:
 *   NativeBridge.showToast("Hello!");
 *   NativeBridge.vibrate(200);
 *   var info = NativeBridge.getDeviceInfo();
 *   NativeBridge.shareText("Check this out!");
 */
public class WebAppInterface {

    private static final String TAG = "WebAppInterface";
    private static final String PREFS_NAME = "WebAppStorage";
    private final Activity activity;

    public WebAppInterface(Activity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void showToast(String message) {
        activity.runOnUiThread(() -> Toast.makeText(activity, message, Toast.LENGTH_SHORT).show());
    }

    @JavascriptInterface
    public void showLongToast(String message) {
        activity.runOnUiThread(() -> Toast.makeText(activity, message, Toast.LENGTH_LONG).show());
    }

    @JavascriptInterface
    public void vibrate(int duration) {
        try {
            Vibrator v = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
            if (v != null) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    v.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE));
                } else {
                    v.vibrate(duration);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Vibrate error", e);
        }
    }

    @JavascriptInterface
    public String getDeviceInfo() {
        try {
            JSONObject info = new JSONObject();
            info.put("manufacturer", Build.MANUFACTURER);
            info.put("model", Build.MODEL);
            info.put("brand", Build.BRAND);
            info.put("device", Build.DEVICE);
            info.put("sdkVersion", Build.VERSION.SDK_INT);
            info.put("androidVersion", Build.VERSION.RELEASE);
            info.put("appVersion", "1.0.0");
            info.put("appVersionCode", 1);
            info.put("packageName", "com.privatizerapps.ultracallvault");
            return info.toString();
        } catch (Exception e) {
            Log.e(TAG, "getDeviceInfo error", e);
            return "{}";
        }
    }

    @JavascriptInterface
    public void shareText(String text) {
        try {
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("text/plain");
            shareIntent.putExtra(Intent.EXTRA_TEXT, text);
            activity.startActivity(Intent.createChooser(shareIntent, "Share via"));
        } catch (Exception e) {
            Log.e(TAG, "Share error", e);
        }
    }

    @JavascriptInterface
    public void shareUrl(String url) {
        shareText(url);
    }

    @JavascriptInterface
    public void openExternalBrowser(String url) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            activity.startActivity(intent);
        } catch (Exception e) {
            Log.e(TAG, "Open browser error", e);
        }
    }

    @JavascriptInterface
    public void copyToClipboard(String text) {
        try {
            activity.runOnUiThread(() -> {
                ClipboardManager clipboard = (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
                ClipData clip = ClipData.newPlainText("Copied", text);
                clipboard.setPrimaryClip(clip);
                Toast.makeText(activity, "Copied to clipboard", Toast.LENGTH_SHORT).show();
            });
        } catch (Exception e) {
            Log.e(TAG, "Clipboard error", e);
        }
    }

    @JavascriptInterface
    public int getBatteryLevel() {
        try {
            BatteryManager bm = (BatteryManager) activity.getSystemService(Context.BATTERY_SERVICE);
            if (bm != null) {
                return bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY);
            }
        } catch (Exception e) {
            Log.e(TAG, "Battery error", e);
        }
        return -1;
    }

    @JavascriptInterface
    public String getNetworkType() {
        try {
            ConnectivityManager cm = (ConnectivityManager) activity.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm != null) {
                android.net.NetworkInfo info = cm.getActiveNetworkInfo();
                if (info != null && info.isConnected()) {
                    return info.getTypeName();
                }
            }
            return "none";
        } catch (Exception e) {
            return "unknown";
        }
    }

    @JavascriptInterface
    public void saveToStorage(String key, String value) {
        try {
            SharedPreferences prefs = activity.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            prefs.edit().putString(key, value).apply();
        } catch (Exception e) {
            Log.e(TAG, "Storage save error", e);
        }
    }

    @JavascriptInterface
    public String loadFromStorage(String key) {
        try {
            SharedPreferences prefs = activity.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            return prefs.getString(key, null);
        } catch (Exception e) {
            Log.e(TAG, "Storage load error", e);
            return null;
        }
    }

    @JavascriptInterface
    public void exitApp() {
        activity.runOnUiThread(() -> activity.finishAffinity());
    }

    @JavascriptInterface
    public void setStatusBarColor(String hexColor) {
        activity.runOnUiThread(() -> {
            try {
                activity.getWindow().setStatusBarColor(android.graphics.Color.parseColor(hexColor));
            } catch (Exception e) {
                Log.e(TAG, "Status bar color error", e);
            }
        });
    }

    @JavascriptInterface
    public void log(String message) {
        Log.d(TAG, "[JS] " + message);
    }
}
