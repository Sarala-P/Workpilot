function SkeletonLoader({ count = 3, height = '120px' }) {
  return (
    <div className="row g-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="col-md-4"><div className="skeleton rounded" style={{ height }} /></div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
