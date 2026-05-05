import Link from "next/link";

export default function Footer() {
  return (
    <footer className='border-t border-border bg-background mt-auto'>
      <div className='mx-auto container px-4 py-12 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Brand */}
          <div>
            <div className='mb-3'>
              <div className='gold-gradient-text text-2xl font-black italic tracking-tighter'>
                APHEENX
              </div>
              <div className='text-[10px] text-gold tracking-wider'>
                🔥 PREMIUM
              </div>
            </div>
            <p className='text-sm text-muted leading-relaxed'>
              Premium eCommerce and video streaming platform
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className='mb-4 text-sm font-semibold text-gold'>Shop</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/shop'
                  className='text-sm text-muted hover:text-foreground transition-colors'
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href='/shop'
                  className='text-sm text-muted hover:text-foreground transition-colors'
                >
                  Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div>
            <h3 className='mb-4 text-sm font-semibold text-gold'>Content</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/video'
                  className='text-sm text-muted hover:text-foreground transition-colors'
                >
                  Videos
                </Link>
              </li>
              <li>
                <Link
                  href='/wishlist'
                  className='text-sm text-muted hover:text-foreground transition-colors'
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className='mb-4 text-sm font-semibold text-gold'>Account</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/account'
                  className='text-sm text-muted hover:text-foreground transition-colors'
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href='/account/orders'
                  className='text-sm text-muted hover:text-foreground transition-colors'
                >
                  Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-10 border-t border-border pt-6 text-center'>
          <p className='text-sm text-muted'>
            © 2026 APHEENX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
