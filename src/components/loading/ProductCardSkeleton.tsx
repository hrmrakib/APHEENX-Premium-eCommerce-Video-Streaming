export function ProductCardSkeleton() {
  return (
    <div className='group block animate-pulse'>
      <div className='overflow-hidden rounded-xl bg-surface-light border border-border'>
        {/* Image Skeleton */}
        <div className='relative h-64 bg-white/5' />

        {/* Info Skeleton */}
        <div className='p-4 space-y-3'>
          {/* Title */}
          <div className='h-5 w-3/4 rounded-md bg-white/10' />

          {/* Description Lines */}
          <div className='space-y-2'>
            <div className='h-3 w-full rounded bg-white/5' />
            <div className='h-3 w-5/6 rounded bg-white/5' />
          </div>

          {/* Price Row */}
          <div className='mt-3 flex items-baseline gap-2'>
            <div className='h-6 w-16 rounded bg-gold/20' />
            <div className='h-4 w-12 rounded bg-white/5' />
          </div>

          {/* Stock Status */}
          <div className='mt-1 h-3 w-20 rounded bg-success/10' />
        </div>
      </div>
    </div>
  );
}
