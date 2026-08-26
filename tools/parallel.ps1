<#
  계정 3개로 병렬 순회하기.

  왜 프로필을 나누는가:
    ART 는 ASP.NET WebForms 라 **마법사가 몇 번째 화면인지를 서버가 세션에 들고
    있습니다.** 세션은 로그인 쿠키 하나에 붙습니다. 그래서 같은 계정으로 창만
    늘리면 A 가 7단계까지 걸어간 사이 B 가 처음으로 되돌리고, A 는 자기가 아직
    7단계인 줄 알고 다음을 눌러 **엉뚱한 화면의 결과를 자기 기록으로 적습니다.**
    오류가 나지 않으므로 조용히 틀립니다.

    쿠키는 크롬 프로필(user-data-dir)마다 따로입니다. 프로필을 나누고 계정을
    달리 로그인하면 세션이 완전히 갈립니다.

  사용법 (tools 폴더에서):
    .\parallel.ps1 status          지금 떠 있는 디버그 크롬 확인
    .\parallel.ps1 setup           a 프로필을 복제해 b, c 를 만듭니다 (크롬 전부 닫고)
    .\parallel.ps1 start           b, c 를 9223 / 9224 로 띄웁니다
    .\parallel.ps1 stop            b, c 만 닫습니다 (a 와 사용자 크롬은 안 건드림)

  주의: 사용자가 평소 쓰는 크롬(기본 프로필)은 이 스크립트가 절대 건드리지
  않습니다. user-data-dir 이 .chrome-debug* 인 것만 고릅니다.
#>
param([Parameter(Position = 0)][string]$Cmd = 'status')

$ErrorActionPreference = 'Stop'
$Root    = Split-Path -Parent $PSScriptRoot          # ...\art-korean
$Chrome  = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$Start   = 'https://www.advancedreachtool.com/loggedin/myscenarios.aspx'

# 일꾼 정의. a 는 이미 쓰고 있는 것이라 여기서 만들지 않습니다.
$Workers = @(
  @{ Id = 'a'; Port = 9222; Dir = Join-Path $Root '.chrome-debug'   }
  @{ Id = 'b'; Port = 9223; Dir = Join-Path $Root '.chrome-debug-b' }
  @{ Id = 'c'; Port = 9224; Dir = Join-Path $Root '.chrome-debug-c' }
)

function Get-DebugChrome {
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
    Where-Object { $_.CommandLine -match [regex]::Escape('.chrome-debug') }
}

function Test-Port($port) {
  try {
    $r = Invoke-RestMethod -Uri "http://127.0.0.1:$port/json/list" -TimeoutSec 3
    $art = @($r | Where-Object { $_.type -eq 'page' -and $_.url -match 'advancedreachtool' })
    if ($art.Count -gt 0) { return "ART 탭 $($art.Count)개" }
    return '떠 있음 (ART 탭 없음 — 로그인 필요)'
  } catch { return '응답 없음' }
}

switch ($Cmd) {

  'status' {
    foreach ($w in $Workers) {
      $exists = Test-Path $w.Dir
      $state  = Test-Port $w.Port
      '{0}  포트 {1}  프로필 {2}  {3}' -f $w.Id, $w.Port,
        $(if ($exists) { '있음' } else { '없음' }), $state
    }
    $n = @(Get-DebugChrome).Count
    "`n디버그 크롬 프로세스 $n 개 (사용자 크롬은 세지 않았습니다)"
  }

  'setup' {
    # 복사 중에 원본이 떠 있으면 leveldb 잠금 파일이 딸려 와 새 프로필이
    # 첫 실행에서 프로필을 통째로 버립니다. 그래서 먼저 닫혔는지 확인합니다.
    $live = @(Get-DebugChrome)
    if ($live.Count -gt 0) {
      "디버그 크롬이 $($live.Count)개 떠 있습니다. 먼저 다 닫아 주십시오."
      "  (평소 쓰시는 크롬은 닫지 않으셔도 됩니다)"
      exit 1
    }
    $src = $Workers[0].Dir
    if (-not (Test-Path $src)) { throw "원본 프로필이 없습니다: $src" }

    foreach ($w in $Workers[1..2]) {
      if (Test-Path $w.Dir) { "$($w.Id): 이미 있습니다 — 건너뜁니다"; continue }
      "$($w.Id): 복제 중... (템퍼몽키와 한글화 스크립트가 같이 따라옵니다)"
      # /XJ 심볼릭 링크 건너뜀, /R:0 재시도 안 함, /NFL /NDL 목록 안 찍음
      robocopy $src $w.Dir /E /XJ /R:0 /W:0 /NFL /NDL /NJH /NJS /NP `
        /XF 'LOCK' 'SingletonLock' 'SingletonCookie' 'SingletonSocket' | Out-Null
      if ($LASTEXITCODE -ge 8) { throw "복제 실패 ($LASTEXITCODE)" }
      # 쿠키를 지워 로그인 화면부터 시작하게 합니다 — 계정을 갈아 끼우기 위함.
      foreach ($f in 'Default\Cookies', 'Default\Network\Cookies') {
        $p = Join-Path $w.Dir $f
        if (Test-Path $p) { Remove-Item $p -Force }
      }
      "$($w.Id): 완료 -> $($w.Dir)"
    }
    "`n이제 .\parallel.ps1 start 로 띄우고, 창마다 **다른 계정으로** 로그인하십시오."
  }

  'start' {
    foreach ($w in $Workers[1..2]) {
      if (-not (Test-Path $w.Dir)) { "$($w.Id): 프로필이 없습니다. setup 을 먼저."; continue }
      if ((Test-Port $w.Port) -ne '응답 없음') { "$($w.Id): 이미 떠 있습니다"; continue }
      Start-Process -FilePath $Chrome -ArgumentList @(
        "--remote-debugging-port=$($w.Port)",
        "--user-data-dir=$($w.Dir)",
        '--no-first-run',
        '--no-default-browser-check',
        $Start
      )
      "$($w.Id): 포트 $($w.Port) 으로 띄웠습니다"
    }
    "`n창마다 서로 다른 계정으로 로그인한 뒤 .\parallel.ps1 status 로 확인하십시오."
  }

  'stop' {
    # b, c 만. a 와 사용자 크롬은 그대로 둡니다.
    $kill = Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
      Where-Object { $_.CommandLine -match '\.chrome-debug-[bc]' }
    foreach ($p in $kill) { Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue }
    "b, c 프로필 크롬 $(@($kill).Count)개를 닫았습니다."
  }

  'labels' {
    # 문구 수집을 셋으로 쪼개 동시에 돌립니다. 일감이 겹치지 않게 나뉘고
    # 결과도 파일을 따로 쓰므로 서로 덮어쓰지 않습니다.
    $ready = @()
    foreach ($w in $Workers) {
      if ((Test-Port $w.Port) -match 'ART 탭') { $ready += $w }
      else { "$($w.Id): 포트 $($w.Port) 준비 안 됨 — 건너뜁니다" }
    }
    if ($ready.Count -eq 0) { '준비된 일꾼이 없습니다.'; exit 1 }
    $n = $ready.Count
    for ($i = 0; $i -lt $n; $i++) {
      $w = $ready[$i]
      $env:ART_PORT = $w.Port
      $env:ART_SHARD = "$($i + 1)/$n"
      Start-Process -FilePath 'node' -ArgumentList 'labels.js', '400' `
        -WorkingDirectory $PSScriptRoot -NoNewWindow `
        -RedirectStandardOutput "labels.$($w.Id).log" `
        -RedirectStandardError "labels.$($w.Id).err"
      "$($w.Id): 일꾼 $($i + 1)/$n 시작 (포트 $($w.Port)) -> labels.$($w.Id).log"
    }
    Remove-Item Env:ART_PORT, Env:ART_SHARD -ErrorAction SilentlyContinue
    "`n진행은  python progress.py --watch labels.a.log  로 보십시오."
    "끝나면  python merge_labels.py --write  로 합칩니다."
  }

  'verify' {
    # 계정마다 **처음부터 따로** 순회합니다. 서로 아무것도 공유하지 않으므로
    # 끝난 뒤 compare_edges.py 로 맞대면 '그때그때 다른 곳'이 드러납니다.
    # 기존 crawl_edges.json 은 건드리지 않습니다 (ART_RUN 으로 파일이 갈립니다).
    foreach ($w in $Workers) {
      if ((Test-Port $w.Port) -notmatch 'ART 탭') {
        "$($w.Id): 포트 $($w.Port) 준비 안 됨 — 건너뜁니다"; continue
      }
      $env:ART_PORT = $w.Port
      $env:ART_RUN = "v$($w.Id)"
      Start-Process -FilePath 'node' -ArgumentList 'crawl.js', '2000' `
        -WorkingDirectory $PSScriptRoot -NoNewWindow `
        -RedirectStandardOutput "verify.$($w.Id).log" `
        -RedirectStandardError "verify.$($w.Id).err"
      "$($w.Id): 독립 순회 시작 -> crawl_edges.v$($w.Id).json / verify.$($w.Id).log"
    }
    Remove-Item Env:ART_PORT, Env:ART_RUN -ErrorAction SilentlyContinue
    "`n끝나면  python compare_edges.py crawl_edges.va.json crawl_edges.vb.json crawl_edges.vc.json"
  }

  default { "모르는 명령입니다: $Cmd  (status | setup | start | stop | labels | verify)" }
}
