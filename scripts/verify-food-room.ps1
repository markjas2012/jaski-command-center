$ErrorActionPreference = "Stop"

$project = (Get-Location).Path
$required = @(
  "app/food/page.tsx",
  "app/food/recipes/page.tsx",
  "app/food/kitchen/page.tsx",
  "components/FoodRoom.tsx",
  "components/RecipeBook.tsx",
  "components/KitchenMode.tsx",
  "components/foodRecipeStore.ts",
  "components/FoodVerification.tsx",
  "public/food-backyard/backyard-kettle-hero.webp"
)

Write-Host "Jaski Food Room verification" -ForegroundColor Yellow
$failed = $false
foreach ($relative in $required) {
  $path = Join-Path $project $relative
  if (Test-Path $path) { Write-Host "PASS  $relative" -ForegroundColor Green }
  else { Write-Host "FAIL  $relative" -ForegroundColor Red; $failed = $true }
}

$store = Join-Path $project "components/foodRecipeStore.ts"
if (Test-Path $store) {
  $text = Get-Content $store -Raw
  foreach ($token in @("jaski.food.recipes.v1", "jaski.food.selectedRecipe.v1", "starterRecipes", "formatQuantity")) {
    if ($text.Contains($token)) { Write-Host "PASS  store token: $token" -ForegroundColor Green }
    else { Write-Host "FAIL  store token: $token" -ForegroundColor Red; $failed = $true }
  }
}

if ($failed) { throw "Food Room source verification failed." }
Write-Host "Source verification passed. Start npm run dev and open http://localhost:3000/food/verify" -ForegroundColor Cyan
