$destination = Join-Path $PSScriptRoot "..\public\images\sections"
New-Item -ItemType Directory -Force -Path $destination | Out-Null

$sectionImages = [ordered]@{
    "gold-collection-01.jpg" = "https://houshoshop.jp/data/ebslider/eb4_shop_020/img/f6202b09d9d8e5c1c35ce64a55bb2f69.jpg"
    "gold-collection-02.jpg" = "https://houshoshop.jp/data/ebslider/eb4_shop_020/img/1abc554e76d02121e5c27879dee9fa35.jpg"
    "featured-recommend-01.jpg" = "https://houshoshop.jp/data/ebslider/eb4_shop_020/img/4aad4a2818fc8a8915234677d778ae5d.jpg"
    "featured-recommend-02.jpg" = "https://houshoshop.jp/data/ebslider/eb4_shop_020/img/0a03a98b4ddba9dc0f04ace3bb7012d8.jpg"
    "hit-items.jpg" = "https://houshoshop.jp/data/ebslider/eb4_shop_020/img/e8fef0317d0c7fb34d45739395c383cc.jpg"
    "recommend-items.jpg" = "https://houshoshop.jp/data/ebslider/eb4_shop_020/img/367dfed0562a656140644a3a1d9ac905.jpg"
    "new-items.jpg" = "https://houshoshop.jp/data/ebslider/eb4_shop_020/img/7087f04ad41c97a810b32b14c3e6a06e.jpg"
    "popular-items.jpg" = "https://houshoshop.jp/data/ebslider/eb4_shop_020/img/ac8c4fe7394aa5416c683f11c527affe.jpg"
    "sale-items.jpg" = "https://houshoshop.jp/data/ebslider/eb4_shop_020/img/f52475e8152846299ad88ba16325ed63.jpg"
}

foreach ($entry in $sectionImages.GetEnumerator()) {
    $target = Join-Path $destination $entry.Key
    Invoke-WebRequest -Uri $entry.Value -OutFile $target
    Write-Host "Downloaded $($entry.Key)"
}
