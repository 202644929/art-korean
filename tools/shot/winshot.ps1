# 특정 창의 내용만 캡처합니다. PrintWindow 를 쓰므로
# 창을 앞으로 끌어오지 않고, 키보드 입력도 보내지 않습니다.
param(
  [int]$ProcId,
  [string]$Out,
  [int]$Width = 1360,
  [int]$Height = 900
)
Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WCap {
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr h, IntPtr hdc, uint flags);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h, int x, int y, int w, int t, bool rp);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] public static extern IntPtr SetThreadDpiAwarenessContext(IntPtr c);
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
}
"@

# 150% 배율 환경에서 PrintWindow 는 물리 픽셀로 그립니다.
# DPI 인식을 켜야 GetWindowRect 도 물리 픽셀을 돌려주고 캡처가 안 잘립니다.
try { [void][WCap]::SetThreadDpiAwarenessContext([IntPtr](-4)) } catch { [void][WCap]::SetProcessDPIAware() }

$p = Get-Process -Id $ProcId -ErrorAction Stop
$h = $p.MainWindowHandle
if ($h -eq 0) { Write-Output "NOWINDOW"; exit 1 }

# 최대화/최소화 상태면 먼저 보통 창으로 되돌려야 MoveWindow 가 먹습니다
[void][WCap]::ShowWindow($h, 9)
Start-Sleep -Milliseconds 600
# 스샷 크기를 일정하게 — 창을 옮기기만 하고 포커스는 안 뺏습니다
[void][WCap]::MoveWindow($h, 40, 40, $Width, $Height, $true)
Start-Sleep -Milliseconds 1100

$r = New-Object WCap+RECT
[void][WCap]::GetWindowRect($h, [ref]$r)
$w = $r.R - $r.L; $t = $r.B - $r.T

$bmp = New-Object System.Drawing.Bitmap($w, $t)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$hdc = $g.GetHdc()
# 2 = PW_RENDERFULLCONTENT (크롬처럼 하드웨어 가속 창도 잡힘)
$ok = [WCap]::PrintWindow($h, $hdc, 2)
$g.ReleaseHdc($hdc)
$g.Dispose()
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "SAVED:$Out ${w}x${t} printwindow=$ok"
