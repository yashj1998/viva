// ==========================================================================
// ViVA E-Commerce — Newsletter AJAX Logic
// ==========================================================================

$(document).ready(function() {
  const $form = $('#newsletter-form');
  const $input = $('#newsletter-email');
  const $btn = $('#newsletter-btn');
  const $msg = $('#newsletter-message');

  $form.on('submit', function(e) {
    e.preventDefault();
    const email = $input.val().trim();

    // Client-side regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address.', 'error');
      $input.focus();
      return;
    }

    $btn.prop('disabled', true).text('Subscribing...');

    $.ajax({
      url: '/api/newsletter',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email: email }),
      success: function(response) {
        if (response.success) {
          showMessage(response.message, 'success');
          $input.val('');
        } else {
          showMessage(response.message || 'Error subscribing.', 'error');
        }
      },
      error: function(xhr) {
        const errorMsg = xhr.responseJSON && xhr.responseJSON.message 
          ? xhr.responseJSON.message 
          : 'Something went wrong. Please try again.';
        showMessage(errorMsg, 'error');
      },
      complete: function() {
        $btn.prop('disabled', false).text('Subscribe');
      }
    });
  });

  function showMessage(text, type) {
    $msg.removeClass('hidden text-emerald-300 text-rose-300')
      .addClass(type === 'success' ? 'text-emerald-300' : 'text-rose-300')
      .text(text);
  }
});
