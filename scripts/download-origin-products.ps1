param(
    [Parameter(Mandatory = $true)]
    [string]$SourceHtml
)

$productIds = @(
    1686512752, 1686421772, 1686421752, 1686421691,
    1686513058, 1686477210, 1686421787, 1686421748,
    1686477219, 1686421858, 1686421650, 1686421638,
    1686516120, 1686516111, 1686516070,
    1686515596, 1686509080, 1686484531, 1686421906
)

$html = Get-Content -Raw -LiteralPath $SourceHtml
$destination = Join-Path $PSScriptRoot "..\public\images\products"
New-Item -ItemType Directory -Force -Path $destination | Out-Null

$imagePattern = 'https://houshoshop\.jp/data/item/[^"? ]+\.jpg'
$urls = [regex]::Matches($html, $imagePattern) | ForEach-Object Value | Sort-Object -Unique

foreach ($productId in $productIds) {
    $productUrls = $urls | Where-Object {
        $_ -match "/$productId/" -and $_ -notmatch '_60x60\.jpg$'
    }

    $index = 1
    foreach ($url in ($productUrls | Select-Object -First 2)) {
        $fileName = "{0}-{1:d2}.jpg" -f $productId, $index
        Invoke-WebRequest -Uri $url -OutFile (Join-Path $destination $fileName)
        Write-Host "Downloaded $fileName"
        $index++
    }
}
