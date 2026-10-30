$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$artifactDir = 'C:\Users\acer\.gemini\antigravity-ide\brain\8378750b-08e0-4c00-95ad-8bbeab8139d5'

$viewports = @(
  @{ w = 1366; h = 768;  name = '1366' },
  @{ w = 1024; h = 768;  name = '1024' },
  @{ w = 768;  h = 1024; name = '768' },
  @{ w = 430;  h = 932;  name = '430' },
  @{ w = 390;  h = 844;  name = '390' },
  @{ w = 375;  h = 667;  name = '375' },
  @{ w = 360;  h = 800;  name = '360' },
  @{ w = 320;  h = 568;  name = '320' }
)

foreach ($vp in $viewports) {
  $tempFile = "C:\Users\acer\shot_$($vp.name).png"
  $destFile = "$artifactDir\shot_$($vp.name).png"
  $args = @(
    '--headless=new',
    '--virtual-time-budget=2500',
    "--window-size=$($vp.w),$($vp.h)",
    "--screenshot=$tempFile",
    'http://localhost:4173/intro.html?state=landed'
  )
  Start-Process -FilePath $chrome -ArgumentList $args -Wait
  if (Test-Path $tempFile) {
    Copy-Item $tempFile $destFile -Force
    Write-Output "Captured $($vp.name): $($vp.w)x$($vp.h)"
  } else {
    Write-Output "Failed to capture $($vp.name)"
  }
}
