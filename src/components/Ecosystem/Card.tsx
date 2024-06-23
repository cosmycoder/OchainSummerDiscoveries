import { GraphNode } from '@/types/api';
import Image from 'next/image';

type Props = GraphNode;

function getNiceDomainDisplayFromUrl(url: string) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0];
}

export default function Card({ id, url, description, imageUrl }: Props) {
  return (
    <a
      href={url}
      rel="noreferrer noopener"
      target="_blank"
      className="flex w-full flex-col justify-start gap-8 bg-gray p-8 visited:opacity-50 hover:bg-darkgray"
    >
      <div className="flex flex-row justify-between">
        <div className="relative h-[80px] w-[80px] overflow-hidden rounded-[3px]">
          <Image src={imageUrl} fill style={{ objectFit: 'contain' }} alt={`Logo of ${id}`} />
        </div>

      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h3 className="font-mono text-xl uppercase text-white">{id}</h3>
          <span className="muted truncate font-mono text-muted">
            {getNiceDomainDisplayFromUrl(url)}
          </span>
        </div>
        <p className="ecosystem-card-description font-sans text-base text-white">
          {description}
        </p>
      </div>
    </a>
  );
}