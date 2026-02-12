const sortDropdown = document.getElementById('SortBy_vertical');

if (sortDropdown) {
 const urlParams = new URLSearchParams(window.location.search);
 const savedSort = sessionStorage.getItem('userSortPreference');

 // If no URL sort param but we have a saved preference, update URL 
 if (!urlParams.has('sort_by') && savedSort) {
   const newUrl = new URL(window.location.href);
   newUrl.searchParams.set('sort_by', savedSort);
   window.location.href = newUrl.toString();
 }

 // If URL has sort param, save it as preference
 const currentSort = urlParams.get('sort_by');
 if (currentSort) {
   sessionStorage.setItem('userSortPreference', currentSort);
 }

 sortDropdown.addEventListener('change', (e) => {
   sessionStorage.setItem('userSortPreference', e.target.value);
 });
}