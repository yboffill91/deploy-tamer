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
import {
  ChevronsUpDown,
  Circle,
  Dot,
  Layers,
  Link2,
  ListEndIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatNumberAbbreviated } from './helpers/formatNumberAbbreviated';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';

interface MockData {
  url: string;
  globalVolume: number;
  globalKd: number;
  childNodes: {
    path: string;
    nodeVolume: number;
    nodeKd: number;
    searchIntent: 'TRANSACTIONAL' | 'INFORMATIONAL';
    keywords: {
      keyword: string;
      volume: number;
      kd: number;
    }[];
  }[];
}

const mockData: MockData[] = [
  {
    url: 'example.com',
    globalVolume: 395000,
    globalKd: 44.5,
    childNodes: [
      {
        path: '/blog/seo-basico',
        nodeVolume: 245000,
        nodeKd: 45,
        searchIntent: 'INFORMATIONAL',
        keywords: [
          { keyword: 'seo', volume: 120000, kd: 55 },
          { keyword: 'seo basico', volume: 80000, kd: 42 },
          { keyword: 'posicionamiento web', volume: 45000, kd: 38 },
        ],
      },
      {
        path: '/blog/marketing-digital',
        nodeVolume: 150000,
        nodeKd: 44,
        searchIntent: 'TRANSACTIONAL',
        keywords: [
          { keyword: 'marketing digital', volume: 90000, kd: 48 },
          { keyword: 'estrategia digital', volume: 60000, kd: 40 },
        ],
      },
    ],
  },
  {
    url: 'mysite.com',
    globalVolume: 600000,
    globalKd: 44.75,
    childNodes: [
      {
        path: '/guias/seo-on-page',
        nodeVolume: 200000,
        nodeKd: 60,
        searchIntent: 'INFORMATIONAL',
        keywords: [{ keyword: 'seo on page', volume: 200000, kd: 60 }],
      },
      {
        path: '/servicios/consultoria-seo',
        nodeVolume: 190000,
        nodeKd: 41,
        searchIntent: 'TRANSACTIONAL',
        keywords: [
          { keyword: 'consultoria seo', volume: 85000, kd: 45 },
          { keyword: 'servicio seo', volume: 65000, kd: 41 },
          { keyword: 'agencia seo', volume: 40000, kd: 37 },
        ],
      },
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
    <div className='min-h-screen bg-muted/30 p-6'>
      <div className='grid  lg:grid-cols-5 gap-6  mx-auto'>
        <div className='col-span-3'>
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
              {mockData.map((data, idx) => (
                <Card key={data.url + idx} className='p-0'>
                  <CardHeader className='rounded-t-lg py-3 bg-success/10 border-b-2'>
                    <div className='flex items-center justify-between gap-2'>
                      <CardTitle className='flex gap-2 items-center'>
                        <Link2 className='text-muted-foreground size-4' />
                        {data.url}
                      </CardTitle>
                      <div className='flex items-center gap-2'>
                        <LabelBadge
                          label='VOL'
                          value={data.globalVolume}
                          formated
                        />
                        <LabelBadge label='KD%' value={data.globalKd} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='px-1'>
                    {data.childNodes.map((child, childIdx) => (
                      <ChildNodeCard
                        key={child.path + childIdx}
                        child={child}
                      />
                    ))}
                  </CardContent>
                </Card>
              ))}
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
        </div>

        <div className='col-span-2'>
          <Card className='sticky top-6'>
            <CardHeader>
              <div className='flex items-center justify-start'>
                <div className='flex items-center justify-center bg-success rounded-lg p-2'>
                  <ListEndIcon className='size-6 text-white' />
                </div>
                <div className='flex flex-col items-baseline p-2 gap-1'>
                  <CardTitle>Hierarchy tree</CardTitle>
                  <CardDescription className='flex'>
                    Keywords, Path, URL Map
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className='p-6'>
              <TreeVisualization data={mockData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface ChildNodeCardProps {
  child: {
    path: string;
    nodeVolume: number;
    nodeKd: number;
    searchIntent: 'TRANSACTIONAL' | 'INFORMATIONAL';
    keywords: {
      keyword: string;
      volume: number;
      kd: number;
    }[];
  };
}

const ChildNodeCard = ({ child }: ChildNodeCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Card className='border-none'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-muted-foreground'>
              {child.path}
            </CardTitle>
            <div className='flex gap-2 items-center'>
              <LabelBadge label='VOL' formated value={child.nodeVolume} />
              <LabelBadge label='KD%' value={child.nodeKd} />
              <Badge
                variant={
                  child.searchIntent === 'INFORMATIONAL' ? 'info' : 'warning'
                }
              >
                {child.searchIntent}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className='mx-1 space-y-2'>
          {/* Single keyword */}
          {child.keywords.length === 1 && (
            <OrganicURLCard
              kd={child.keywords[0].kd}
              keyword={child.keywords[0].keyword}
              volume={child.keywords[0].volume}
              isPrimary
            />
          )}

          {/* Multiple keywords with collapsible */}
          {child.keywords.length > 1 && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <div className='cursor-pointer'>
                  <OrganicURLCard
                    kd={child.keywords[0].kd}
                    keyword={child.keywords[0].keyword}
                    volume={child.keywords[0].volume}
                    isPrimary
                    isCollapsible
                    isOpen={isOpen}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className='space-y-2 mt-2'>
                {child.keywords.slice(1).map((kw, idx) => (
                  <OrganicURLCard
                    key={kw.keyword + idx}
                    keyword={kw.keyword}
                    kd={kw.kd}
                    volume={kw.volume}
                    isPrimary={false}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
      <Separator />
    </div>
  );
};

interface Props {
  keyword: string;
  volume: number;
  kd: number;
  isPrimary?: boolean;
  isCollapsible?: boolean;
  isOpen?: boolean;
}

export const OrganicURLCard = ({
  keyword,
  volume,
  kd,
  isPrimary = false,
  isCollapsible = false,
  isOpen = false,
}: Props) => {
  return (
    <div
      className={cn(
        'w-full flex items-center justify-between p-2 rounded-md border font-semibold',
        isPrimary ? 'bg-success/10 border-success/50' : ''
      )}
    >
      <span className='flex items-center gap-2'>
        {isPrimary && <span className='text-success'>★</span>}
        {keyword}
      </span>
      <div className='flex items-center gap-2'>
        <LabelBadge label='VOL' value={volume} formated />
        <LabelBadge label='KD%' value={kd} />
        {isCollapsible && (
          <Button variant='ghost' size='xs' className='h-6 w-6 p-0'>
            <ChevronsUpDown
              className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </Button>
        )}
      </div>
    </div>
  );
};

interface PropsLabelBadge {
  label: string;
  value: number;
  formated?: boolean;
}

const LabelBadge = ({ label, value, formated = false }: PropsLabelBadge) => {
  return (
    <div className='flex items-center gap-1'>
      <span className='text-xs text-foreground/30'>{label} </span>
      {formated ? formatNumberAbbreviated(value) : value}
    </div>
  );
};

interface TreeVisualizationProps {
  data: MockData[];
}

const TreeVisualization = ({ data }: TreeVisualizationProps) => {
  return (
    <div className='space-y-6'>
      {data.map((urlData, urlIdx) => (
        <div key={urlData.url + urlIdx} className='space-y-3'>
          {/* Root URL Node */}
          <div className='flex items-start gap-3'>
            <div className='flex flex-col items-center'>
              <div className='w-3 h-3 rounded-full bg-success' />
              <div className='w-0.5 h-full bg-border min-h-10' />
            </div>
            <div className='flex-1 pt-0.5'>
              <div className='font-semibold text-sm'>{urlData.url}</div>
              <div className='text-xs text-muted-foreground flex gap-2 mt-1'>
                <span>
                  VOL: {formatNumberAbbreviated(urlData.globalVolume)}
                </span>
                <span>KD: {urlData.globalKd}%</span>
              </div>
            </div>
          </div>

          {/* Child Nodes (Paths) */}
          {urlData.childNodes.map((child, childIdx) => (
            <div key={child.path + childIdx} className='ml-6 space-y-2'>
              <div className='flex items-start gap-3'>
                <div className='flex flex-col items-center'>
                  <div
                    className={cn(
                      'w-2.5 h-2.5 rounded-full',
                      child.searchIntent === 'INFORMATIONAL'
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    )}
                  />
                  <div className='w-0.5 h-full bg-border/50 min-h-7.5' />
                </div>
                <div className='flex-1 pt-0.5'>
                  <div className='font-medium text-xs text-muted-foreground'>
                    {child.path}
                  </div>
                  <div className='text-xs text-muted-foreground/70 flex gap-2 mt-0.5'>
                    <span>
                      VOL: {formatNumberAbbreviated(child.nodeVolume)}
                    </span>
                    <span>KD: {child.nodeKd}%</span>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              {child.keywords.map((kw, kwIdx) => (
                <div
                  key={kw.keyword + kwIdx}
                  className='ml-6 flex items-center gap-3'
                >
                  <div
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      kwIdx === 0 ? 'bg-success' : 'bg-muted-foreground/40'
                    )}
                  />
                  <div className='flex-1'>
                    <div
                      className={cn(
                        'text-xs',
                        kwIdx === 0
                          ? 'font-medium text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {kwIdx === 0 && '★ '}
                      {kw.keyword}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
