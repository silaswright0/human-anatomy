/* Side ads are plain browser slots. A static host is enough.
   When an ad network approves the site, paste its snippet into the
   matching [data-ad-slot] element and hide that slot's .ad-fallback.

   Example, after AdSense gives you a publisher id and a unit id:

   var slot = document.querySelector('[data-ad-slot="left"]');
   slot.insertAdjacentHTML("beforeend",
     '<ins class="adsbygoogle" style="display:block" ' +
     'data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="YYYYYYYY"></ins>');
   slot.querySelector(".ad-fallback").hidden = true;
   (window.adsbygoogle = window.adsbygoogle || []).push({});

   Load the network script once, from index.html:
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX" crossorigin="anonymous"></script>

   Slots:
   - left, right: 160 × 600 skyscrapers, shown when the window is wide
   - bottom: 728 × 90, shown when the side rails would crowd the plate
*/
(function () {
  window.mountAds = function mountAds() {};
})();
