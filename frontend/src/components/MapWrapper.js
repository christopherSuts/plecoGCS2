'use client';

import LeafletMap from './LeafletMap';

import dynamic from 'next/dynamic';

// const LeafletMap = dynamic(() => import('./LeafletMap'), {
//   ssr: false,
// });

export default function MapWrapper(props) {
  return <LeafletMap {...props} />;
}