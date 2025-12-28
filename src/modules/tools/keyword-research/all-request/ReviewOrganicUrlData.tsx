'use client';
import {
  Badge,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Separator,
} from '@/components/ui';
import {
  ChevronsUpDown,
  Circle,
  Columns2,
  Dot,
  Layers,
  Link2,
  ListEndIcon,
  PanelLeft,
  PanelRight,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { formatNumberAbbreviated } from './helpers/formatNumberAbbreviated';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { HierarchyTree } from './HeriarchyTree/HeriairchyTree';
import { ImperativePanelHandle } from 'react-resizable-panels';

interface MockData {
  url: string;
  globalVolume: number;
  globalKd: number;
  topics: {
    id: string;
    path: string;
    volume: number;
    kd: number;
    searchIntent: 'TRANSACTIONAL' | 'INFORMATIONAL';
    keywords: {
      keyword: string;
      volume: number;
      kd: number;
    }[];
  }[];
}

const mockData: MockData = {
  url: 'example.com',
  globalVolume: 395000,
  globalKd: 44.5,
  topics: [
    {
      id: '1',
      path: '/blog/seo-basico',
      volume: 245000,
      kd: 45,
      searchIntent: 'INFORMATIONAL',
      keywords: [
        { keyword: 'seo', volume: 120000, kd: 55 },
        { keyword: 'seo basico', volume: 80000, kd: 42 },
        { keyword: 'posicionamiento web', volume: 45000, kd: 38 },
      ],
    },
    {
      id: '2',
      path: '/blog/marketing-digital',
      volume: 150000,
      kd: 44,
      searchIntent: 'TRANSACTIONAL',
      keywords: [
        { keyword: 'marketing digital', volume: 90000, kd: 48 },
        { keyword: 'estrategia digital', volume: 60000, kd: 40 },
      ],
    },
  ],
};

export const ReviewOrganicUrlData = () => {
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  return (
    <div className='min-h-screen bg-muted/30 p-6'>
      <div className='w-full flex justify-center bg-muted/20 rounded my-2 '>
        <ButtonGroup>
          <Button
            variant={'outline'}
            size='icon'
            onClick={() => {
              leftPanelRef.current.resize(25);
              rightPanelRef.current.resize(100);
            }}
          >
            <PanelLeft />
          </Button>
          <ButtonGroupSeparator />
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              leftPanelRef.current.resize(50);
              rightPanelRef.current.resize(50);
            }}
          >
            <Columns2 />
          </Button>
          <ButtonGroupSeparator />

          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              leftPanelRef.current.resize(100);
              rightPanelRef.current.collapse();
            }}
          >
            <PanelRight />
          </Button>
        </ButtonGroup>
      </div>
      <ResizablePanelGroup direction='horizontal' className='border rounded-lg'>
        <ResizablePanel defaultSize={60} className='p-2' ref={leftPanelRef}>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-start'>
                <div className='flex items-center justify-center bg-success rounded-lg p-2'>
                  <Layers className='size-6 text-white' />
                </div>
                <div className='flex flex-col items-baseline p-2 gap-1'>
                  <CardTitle>URL Structure</CardTitle>
                  <CardDescription className='flex'>
                    Cluster <Dot /> xxx keywords{' '}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className='flex-col gap-4 flex'>
              <Card className='p-0'>
                <CardHeader className='rounded-t-lg py-3 bg-muted/20 text-muted-foreground border-b-2'>
                  <div className='flex items-center justify-between gap-2'>
                    <CardTitle className='flex gap-2 items-center'>
                      <Link2 className='text-muted-foreground size-4' />
                      {mockData.url}
                    </CardTitle>
                    <div className='flex items-center gap-2'>
                      <LabelBadge
                        label='VOL'
                        value={mockData.globalVolume}
                        formated
                      />
                      <LabelBadge label='KD%' value={mockData.globalKd} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='px-1'>
                  {mockData.topics.map((child, childIdx) => (
                    <ChildNodeCard key={child.path + childIdx} child={child} />
                  ))}
                </CardContent>
              </Card>
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
        </ResizablePanel>
        <ResizableHandle />

        <ResizablePanel defaultSize={40} className='p-2' ref={rightPanelRef}>
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
              <HierarchyTree data={mockData} />
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

interface ChildNodeCardProps {
  child: {
    path: string;
    volume: number;
    kd: number;
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
              <LabelBadge label='VOL' formated value={child.volume} />
              <LabelBadge label='KD%' value={child.kd} />
              <Badge className='capitalize' variant={'info'}>
                {child.searchIntent.toLowerCase().slice(0, 2)}
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
    <Badge
      variant='outline'
      className='flex items-center gap-1 text-xs border-none bg-transparent'
    >
      <span className=' text-foreground/30'>{label} </span>
      {formated ? formatNumberAbbreviated(value) : value}
    </Badge>
  );
};


