'use client';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from '@/components/ui';
import { Circle, Dot, Layers, Link, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatNumberAbbreviated } from './helpers/formatNumberAbbreviated';
import { cn } from '@/lib/utils';

const mockData = [
  {
    id: 1,
    url: 'example.com/blog/seo-basico',
    keywords: [
      { keyword: 'seo', volume: 246000 },
      { keyword: 'seo basico', volume: 90500 },
      { keyword: 'posicionamiento web', volume: 165000 },
    ],
  },
  {
    id: 2,
    url: 'example.com/blog/marketing-digital',
    keywords: [
      { keyword: 'marketing digital', volume: 301000 },
      { keyword: 'estrategia digital', volume: 74000 },
    ],
  },
  {
    id: 3,
    url: 'example.com/blog/keyword-research',
    keywords: [
      { keyword: 'keyword research', volume: 201000 },
      { keyword: 'investigacion de palabras clave', volume: 88000 },
      { keyword: 'herramientas seo', volume: 132000 },
    ],
  },
  {
    id: 4,
    url: 'example.com/guias/seo-on-page',
    keywords: [
      { keyword: 'seo on page', volume: 178000 },
      { keyword: 'optimizacion on page', volume: 69000 },
    ],
  },
  {
    id: 5,
    url: 'example.com/guias/seo-off-page',
    keywords: [
      { keyword: 'seo off page', volume: 121000 },
      { keyword: 'link building', volume: 254000 },
    ],
  },
  {
    id: 6,
    url: 'example.com/blog/analitica-web',
    keywords: [
      { keyword: 'analitica web', volume: 94000 },
      { keyword: 'google analytics', volume: 410000 },
    ],
  },
  {
    id: 7,
    url: 'example.com/blog/contenido-seo',
    keywords: [
      { keyword: 'contenido seo', volume: 87000 },
      { keyword: 'marketing de contenidos', volume: 190000 },
    ],
  },
  {
    id: 8,
    url: 'example.com/blog/optimizacion-web',
    keywords: [
      { keyword: 'optimizacion web', volume: 156000 },
      { keyword: 'velocidad web', volume: 143000 },
    ],
  },
  {
    id: 9,
    url: 'example.com/guias/core-web-vitals',
    keywords: [
      { keyword: 'core web vitals', volume: 112000 },
      { keyword: 'lcp cls fid', volume: 46000 },
    ],
  },
  {
    id: 10,
    url: 'example.com/blog/seo-tecnico',
    keywords: [
      { keyword: 'seo tecnico', volume: 98000 },
      { keyword: 'indexacion web', volume: 52000 },
    ],
  },
  {
    id: 11,
    url: 'example.com/blog/arquitectura-web',
    keywords: [
      { keyword: 'arquitectura web', volume: 61000 },
      { keyword: 'estructura web', volume: 73000 },
    ],
  },
  {
    id: 12,
    url: 'example.com/blog/url-amigables',
    keywords: [
      { keyword: 'urls amigables', volume: 48000 },
      { keyword: 'estructura de urls', volume: 39000 },
    ],
  },
  {
    id: 13,
    url: 'example.com/blog/meta-descripciones',
    keywords: [
      { keyword: 'meta descripciones', volume: 67000 },
      { keyword: 'etiquetas meta', volume: 81000 },
    ],
  },
  {
    id: 14,
    url: 'example.com/blog/titulos-seo',
    keywords: [
      { keyword: 'titulos seo', volume: 54000 },
      { keyword: 'title tags', volume: 119000 },
    ],
  },
  {
    id: 15,
    url: 'example.com/blog/enlazado-interno',
    keywords: [
      { keyword: 'enlazado interno', volume: 72000 },
      { keyword: 'links internos', volume: 86000 },
    ],
  },
  {
    id: 16,
    url: 'example.com/blog/contenido-duplicado',
    keywords: [
      { keyword: 'contenido duplicado', volume: 93000 },
      { keyword: 'seo penalizaciones', volume: 41000 },
    ],
  },
  {
    id: 17,
    url: 'example.com/blog/crawl-budget',
    keywords: [
      { keyword: 'crawl budget', volume: 38000 },
      { keyword: 'rastreo google', volume: 44000 },
    ],
  },
  {
    id: 18,
    url: 'example.com/blog/sitemap-xml',
    keywords: [
      { keyword: 'sitemap xml', volume: 101000 },
      { keyword: 'mapa del sitio', volume: 59000 },
    ],
  },
  {
    id: 19,
    url: 'example.com/blog/robots-txt',
    keywords: [
      { keyword: 'robots txt', volume: 88000 },
      { keyword: 'bloquear indexacion', volume: 27000 },
    ],
  },
  {
    id: 20,
    url: 'example.com/blog/seo-movil',
    keywords: [
      { keyword: 'seo movil', volume: 77000 },
      { keyword: 'mobile first', volume: 132000 },
    ],
  },
];

export const ReviewOrganicUrlData = () => {
  const [geneKeywords, setGeneKeywords] = useState('');

  useEffect(() => {
    const fillKw = () => {
      const rndNumb = (Math.random() * 100).toFixed(0);
      setGeneKeywords(rndNumb);
    };
    fillKw();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-start'>
            <div className='flex items-center justify-center bg-success rounded-lg p-2'>
              <Layers className='size-6 text-white' />
            </div>
            <div className='flex flex-col items-baseline p-2 gap-1'>
              <CardTitle>URL Structure</CardTitle>
              <CardDescription className='flex'>
                {mockData.length} Cluster <Dot /> {geneKeywords} keywords{' '}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
              <CardContent className='flex-col gap-4 flex'>
                  {
                      mockData.map((result) => (
                          <OrganicURLCard key={result.id} keywords={result.keywords} url={result.url} />
                      ))
                  }
          
        </CardContent>
        <Separator />
        <CardFooter>
          <div className=' flex items-center gap-2 text-muted-foreground justify-between w-full'>
            <div className='flex gap-2 items-center'>
              <Circle className='text-success fill-success size-2' /> No
              Cannibalization
            </div>
            <Button variant='success' size='sm'>
              Complete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};



interface Props {
    url: string;
    keywords: {
        keyword: string;
        volume: number;
    } []
}

export const OrganicURLCard = ({url, keywords}: Props) => {
  return (
    <Card className='p-0 gap-0'>
      <CardHeader className='bg-muted/50  rounded-t-xl py-4'>
        <div className=' flex items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <Link className='size-4 text-muted-foreground/50' />
            <CardTitle className='text-success'>/{url}</CardTitle>
          </div>
          <Badge variant='outline' className='border-none text-md'>
            +335K
          </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className='p-2'>
        <div className='flex flex-col w-full gap-2'>
          {keywords.map(({ keyword, volume }, idx) => (
            <span
              key={keyword}
              className={cn(
                'w-full flex items-center justify-between p-2 rounded-md',
                idx === 0
                  ? 'bg-success/10 border border-success/50 font-semibold'
                  : 'bg-muted/10 font-thin text-muted-foreground'
              )}
            >
              <span className='flex items-center gap-2'>
                {' '}
                {idx === 0 && <span className='text-success'>★ </span>} {keyword}{' '}
              </span>
              <Badge
                variant='outline'
                className={cn(
                  idx === 0
                    ? 'bg-success/10 text-success border-success/50 font-semibold'
                    : 'bg-muted/10 text-muted-foreground border-muted'
                )}
              >
                {formatNumberAbbreviated(volume)}
              </Badge>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
