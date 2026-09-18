// ==========================================================================
// ViVA E-Commerce — Main Interactive Client Logic
// ==========================================================================

$(document).ready(function() {
  // 1. Initialize Hero Carousel
  if (typeof Swiper !== 'undefined' && $('.hero-swiper').length) {
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      speed: 600,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: '.hero-pagination',
        clickable: true
      }
    });
  }

  // 2. Initialize Top Picks Deals Carousel
  if (typeof Swiper !== 'undefined' && $('.products-swiper').length) {
    new Swiper('.products-swiper', {
      slidesPerView: 1.25,
      spaceBetween: 16,
      navigation: {
        nextEl: '.products-next',
        prevEl: '.products-prev'
      },
      breakpoints: {
        480: {
          slidesPerView: 2.1,
          spaceBetween: 16
        },
        768: {
          slidesPerView: 3.2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 4.2,
          spaceBetween: 20
        },
        1280: {
          slidesPerView: 5,
          spaceBetween: 20
        }
      }
    });
  }

  // 3. Initialize Testimonial Carousel
  if (typeof Swiper !== 'undefined' && $('.reviews-swiper').length) {
    new Swiper('.reviews-swiper', {
      slidesPerView: 1.1,
      spaceBetween: 16,
      navigation: {
        nextEl: '.reviews-next',
        prevEl: '.reviews-prev'
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24
        }
      }
    });
  }

  // 4. Quick Add to Cart Interaction
  $(document).on('click', '.btn-add-cart', function(e) {
    e.preventDefault();
    const $btn = $(this);
    const productId = $btn.data('id');
    const originalHtml = $btn.html();

    $btn.addClass('scale-90');

    $.ajax({
      url: '/api/cart/add',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ id: productId }),
      success: function(response) {
        if (response.success) {
          // Update cart badge (desktop header & mobile floating bottom nav)
          const $cartBadge = $('#header-cart-badge');
          $cartBadge.text(response.cartCount).removeClass('badge-pop');
          void $cartBadge[0].offsetWidth; // trigger reflow
          $cartBadge.addClass('badge-pop');

          const $mobileCartBadge = $('#mobile-bottom-cart-badge');
          if ($mobileCartBadge.length) {
            $mobileCartBadge.text(response.cartCount).removeClass('badge-pop');
            void $mobileCartBadge[0].offsetWidth;
            $mobileCartBadge.addClass('badge-pop');
          }

          // Temporary button feedback
          $btn.html('<i class="fa-solid fa-check text-xs"></i>');
          setTimeout(() => {
            $btn.removeClass('scale-90').html(originalHtml);
          }, 800);

          showToast('Added to Cart! 🛒');
        }
      },
      error: function(xhr) {
        $btn.removeClass('scale-90').html(originalHtml);
        if (xhr.status === 401 && xhr.responseJSON && xhr.responseJSON.requireLogin) {
          showToast('Please sign in to add items to cart! 🔒');
          setTimeout(() => {
            window.location.href = xhr.responseJSON.redirect || '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }, 800);
        } else {
          showToast('Please sign in to add items! 🔒');
          setTimeout(() => {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }, 800);
        }
      }
    });
  });

  // 5. Wishlist Toggle Interaction
  $(document).on('click', '.btn-wishlist-toggle', function(e) {
    e.preventDefault();
    const $badge = $('#header-wishlist-badge');
    const $mobileWishlistDot = $('#mobile-bottom-wishlist-dot');

    $.ajax({
      url: '/api/wishlist/toggle',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ action: 'add' }),
      success: function(response) {
        if (response.success) {
          $badge.text(response.wishlistCount).removeClass('badge-pop');
          void $badge[0].offsetWidth;
          $badge.addClass('badge-pop');

          if ($mobileWishlistDot.length && response.wishlistCount > 0) {
            $mobileWishlistDot.removeClass('hidden');
          }

          showToast('Saved to Wishlist! ❤️');
        }
      },
      error: function(xhr) {
        if (xhr.status === 401 && xhr.responseJSON && xhr.responseJSON.requireLogin) {
          showToast('Please sign in to save to Wishlist! ❤️');
          setTimeout(() => {
            window.location.href = xhr.responseJSON.redirect || '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }, 800);
        } else {
          showToast('Please sign in to save to Wishlist! ❤️');
          setTimeout(() => {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }, 800);
        }
      }
    });
  });

  // 6. Toast Notification Helper
  function showToast(message) {
    let $toast = $('#viva-toast');
    if (!$toast.length) {
      $toast = $('<div id="viva-toast" class="fixed bottom-24 md:bottom-6 right-4 md:right-6 bg-[#123524] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium z-50 transition-all duration-300 transform translate-y-20 opacity-0 pointer-events-none"></div>');
      $('body').append($toast);
    }
    $toast.text(message).removeClass('translate-y-20 opacity-0').addClass('translate-y-0 opacity-100');
    setTimeout(() => {
      $toast.removeClass('translate-y-0 opacity-100').addClass('translate-y-20 opacity-0');
    }, 2500);
  }
});
