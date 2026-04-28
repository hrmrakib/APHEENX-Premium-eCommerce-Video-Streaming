export default function ProductCardSkeleton() {
  return (
    <div className='overflow-hidden rounded-xl bg-surface-light border border-border'>
      {/* Image */}
      <div className='relative h-64 bg-surface animate-pulse' />

      {/* Info */}
      <div className='p-4 space-y-3'>
        {/* Name */}
        <div className='h-4 w-3/4 rounded-md bg-surface animate-pulse' />

        {/* Description */}
        <div className='space-y-1.5'>
          <div className='h-3 w-full rounded-md bg-surface animate-pulse' />
          <div className='h-3 w-5/6 rounded-md bg-surface animate-pulse' />
        </div>

        {/* Price */}
        <div className='flex items-baseline gap-2 pt-1'>
          <div className='h-5 w-16 rounded-md bg-surface animate-pulse' />
          <div className='h-3.5 w-10 rounded-md bg-surface animate-pulse' />
        </div>

        {/* Stock */}
        <div className='h-3 w-20 rounded-md bg-surface animate-pulse' />
      </div>
    </div>
  );
}
