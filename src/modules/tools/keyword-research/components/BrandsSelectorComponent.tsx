import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '@/components/ui';
import { useBrandStore } from '../context/WordsStoreFactory';
import { GenerateWordsWithAiButton } from './GenerateWordsWithAiButton';
import { Trash2 } from 'lucide-react';

export const BrandsSelectorComponent = () => {
  const Brands = useBrandStore((st) => st.words);
  const isLoading = useBrandStore((st) => st.isLoading);
  const removeBrand = useBrandStore((st) => st.deleteWord);

  return (
    <div className='flex items-center flex-col max-h-[75dvh]'>
      <GenerateWordsWithAiButton isLoading={isLoading} type='Brands' />

      {Brands.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No Brands</EmptyTitle>
            <EmptyDescription className='text-xs'>
              Add Positive Keywords then Generate Brands with AI clicking the
              button bellow
            </EmptyDescription>
            <EmptyContent></EmptyContent>
          </EmptyHeader>
        </Empty>
      )}
      {Brands.length !== 0 && (
        <Table className='mt-6'>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Brands.map((brand, index) => (
              <TableRow key={index}>
                <TableCell>{brand}</TableCell>
                <TableCell className='flex items-center justify-end'>
                  <Button
                    onClick={() => removeBrand(brand)}
                    variant='destructive'
                    size='xs'
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
