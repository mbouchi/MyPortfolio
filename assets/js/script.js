// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
}

// Close menu when a link is clicked
if (navMenu) {
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[name="name"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const subject = this.querySelector('input[name="subject"]').value;
        const message = this.querySelector('textarea[name="message"]').value;
        
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Validate all fields and email format
        if (name && email && subject && message) {
            if (emailRegex.test(email)) {
                // Email is valid, send via Formspree
                const formData = new FormData(this);
                
                fetch('https://formspree.io/f/xldqwkrp', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Show success notification
                        showSuccessNotification(name);
                        // Reset form
                        contactForm.reset();
                    } else {
                        alert('There was an error sending your message. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error sending your message. Please try again.');
                });
            } else {
                // Email is invalid
                alert('Please enter a valid email address');
            }
        } else {
            // Required fields are empty
            alert('Please fill in all fields');
        }
    });
}

// Success notification function
function showSuccessNotification(name) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>Message Sent!</h4>
                <p>Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.</p>
            </div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Add scroll effect to navbar
let lastScrollTop = 0;
const navbar_element = document.querySelector('.navbar');

if (navbar_element) {
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar_element.style.boxShadow = '0 2px 20px rgba(133, 118, 77, 0.2)';
        } else {
            navbar_element.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Intersection Observer for fade-in animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards and skill categories
document.querySelectorAll('.project-card, .skill-category, .stat').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease';
    observer.observe(element);
});

// Active nav link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
            link.style.color = '#85764d';
        } else {
            link.classList.remove('active');
            link.style.color = 'var(--light-text)';
        }
    });
});

// Parallax effect for hero section
const heroSection = document.querySelector('.hero');
if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPosition = `0px ${scrollPosition * 0.5}px`;
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// Back to Top Button
const backToTopBtn = document.getElementById('backToTopBtn');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
// Fetch Latest Blogs from Hashnode
async function fetchHashnodeBlogs() {
    const blogContainer = document.getElementById('blogContainer');
    if (!blogContainer) return;

    try {
        const query = `
            {
                publication(host: "tm-apex.hashnode.dev") {
                    posts(first: 20) {
                        edges {
                            node {
                                id
                                title
                                brief
                                slug
                                publishedAt
                                readTimeInMinutes
                                tags {
                                    name
                                    slug
                                }
                                author {
                                    name
                                }
                                coverImage {
                                    url
                                }
                            }
                        }
                    }
                }
            }
        `;

        const response = await fetch('https://gql.hashnode.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }

        const data = await response.json();
        let posts = data.data.publication.posts.edges;

        // Filter posts by author "Mohamad Bouchi"
        posts = posts.filter(({ node }) => 
            node.author && node.author.name.toLowerCase().includes('mohamad bouchi')
        );

        // Limit to 6 posts
        posts = posts.slice(0, 6);

        if (posts.length === 0) {
            blogContainer.innerHTML = '<div class="blog-error">No blog posts found from Mohamad Bouchi.</div>';
            return;
        }

        blogContainer.innerHTML = posts.map(({ node }) => {
            const publishDate = new Date(node.publishedAt);
            const formattedDate = publishDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const tagsList = node.tags.slice(0, 3).map(tag => 
                `<span class="blog-card-tag">${tag.name}</span>`
            ).join('');

            const coverImageHtml = node.coverImage && node.coverImage.url 
                ? `<img src="${node.coverImage.url}" alt="${node.title}">`
                : '<i class="fas fa-blog"></i>';

            return `
                <div class="blog-card">
                    <div class="blog-card-cover">${coverImageHtml}</div>
                    <div class="blog-card-header">
                        <h3 class="blog-card-title">${node.title}</h3>
                        <div class="blog-card-meta">
                            <span class="blog-card-date">${formattedDate}</span>
                            <span class="blog-card-reading-time">${node.readTimeInMinutes} min read</span>
                        </div>
                    </div>
                    <div class="blog-card-body">
                        <p class="blog-card-excerpt">${node.brief}</p>
                        <div class="blog-card-tags">${tagsList}</div>
                        <a href="https://tm-apex.hashnode.dev/${node.slug}" target="_blank" rel="noopener noreferrer" class="blog-card-link">
                            Read Article <span class="fa fa-external-link"></span>
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        // Setup scroll button functionality
        setupBlogScrollButtons();

    } catch (error) {
        console.error('Error fetching Hashnode blogs:', error);
        blogContainer.innerHTML = `
            <div class="blog-error">
                <p>Unable to load blog posts at this time. <a href="https://tm-apex.hashnode.dev/" target="_blank" style="color: #85764d;">Visit blog</a></p>
            </div>
        `;
    }
}

// Setup blog scroll button functionality
function setupBlogScrollButtons() {
    const scrollPrevBtn = document.getElementById('scrollPrev');
    const scrollNextBtn = document.getElementById('scrollNext');
    const blogGrid = document.querySelector('.blog-grid');

    if (!scrollPrevBtn || !scrollNextBtn || !blogGrid) return;

    const cardWidth = 350;
    const gap = 32; // 2rem = 32px
    const scrollDistance = cardWidth + gap;

    // Smooth scroll
    const scrollWithMomentum = (direction) => {
        const currentScroll = blogGrid.scrollLeft;
        const targetScroll = direction === 'next' 
            ? currentScroll + scrollDistance 
            : currentScroll - scrollDistance;

        blogGrid.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    };

    scrollPrevBtn.addEventListener('click', () => {
        scrollWithMomentum('prev');
    });

    scrollNextBtn.addEventListener('click', () => {
        scrollWithMomentum('next');
    });

    // Update button disabled states based on scroll position
    function updateButtonStates() {
        const isAtStart = blogGrid.scrollLeft <= 10;
        const isAtEnd = blogGrid.scrollLeft >= (blogGrid.scrollWidth - blogGrid.clientWidth - 10);
        
        scrollPrevBtn.disabled = isAtStart;
        scrollNextBtn.disabled = isAtEnd;
        
        // Add visual feedback
        scrollPrevBtn.style.opacity = isAtStart ? '0.5' : '1';
        scrollNextBtn.style.opacity = isAtEnd ? '0.5' : '1';
    }

    blogGrid.addEventListener('scroll', updateButtonStates, { passive: true });
    updateButtonStates();
}

// Load blogs when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchHashnodeBlogs);
} else {
    fetchHashnodeBlogs();
}

// Social Sharing Functionality
document.addEventListener('DOMContentLoaded', function() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const pageUrl = window.location.href;
    const pageTitle = 'Oracle APEX Freelancer & Consultant | MBouchi';
    const pageDescription = 'Expert Oracle APEX Developer available for freelance projects and consulting.';

    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('share-linkedin')) {
                shareOnLinkedIn();
            } else if (this.classList.contains('share-twitter')) {
                shareOnTwitter();
            } else if (this.classList.contains('share-facebook')) {
                shareOnFacebook();
            } else if (this.classList.contains('share-email')) {
                shareViaEmail();
            } else if (this.classList.contains('share-copy')) {
                copyToClipboard();
            }
        });
    });

    function shareOnLinkedIn() {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
        window.open(linkedinUrl, '_blank', 'width=550,height=680');
    }

    function shareOnTwitter() {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    }

    function shareOnFacebook() {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
        window.open(facebookUrl, '_blank', 'width=550,height=680');
    }

    function shareViaEmail() {
        const subject = encodeURIComponent(pageTitle);
        const body = encodeURIComponent(`Check out this amazing Oracle APEX developer profile:\n\n${pageDescription}\n\n${pageUrl}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }

    function copyToClipboard() {
        const copyButton = document.querySelector('.share-copy');
        navigator.clipboard.writeText(pageUrl).then(() => {
            // Show feedback
            const originalIcon = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyButton.innerHTML = originalIcon;
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = pageUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show feedback
            const originalIcon = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyButton.innerHTML = originalIcon;
            }, 2000);
        });
    }
});