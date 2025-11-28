import { Button, Progress } from '@/components/ui';
import { useRegionStore } from '../../context/NewRegionStore';
import { ChevronRight } from 'lucide-react';
import { showToast } from '@/components/CustomToaster';

export const RegionStepController = () => {
  const Step = useRegionStore((st) => st.step);
  const selectedCountry = useRegionStore((st) => st.selectedCountryName);
  const selectedState = useRegionStore((st) => st.selectedState);
  const selectedCities = useRegionStore((st) => st.selectedCities);
  const manegeNextStep = useRegionStore((st) => st.setSteps);
  const clearStates = useRegionStore((st) => st.resetState);
  const setFinalValue = useRegionStore((st) => st.setFinalValue);
  const setPartialRoute = useRegionStore((st) => st.setPartialRoute);

  const onClickHandler = () => {
    if (Step === 'Cities') {
      setFinalValue();
      showToast({
        type: 'success',
        description: `Added to de research ${selectedCountry} / ${selectedState} ${
          selectedCities.length + 0 && '/ ' + selectedCities.length + ' Cities'
        }`,
        message: 'Success',
      });
      clearStates();
    } else {
      setPartialRoute(Step === 'Country' ? selectedCountry : selectedState);

      manegeNextStep();
    }
  };

  return (
    <div className='flex flex-col items-center justify-center mb-2 bg-secondary rounded-md '>
      <div className='w-full '>
        <Button
          disabled={
            (Step === 'Country' && selectedCountry.length === 0) ||
            (Step === 'State' && selectedState.length === 0)
          }
          variant={
            (Step === 'Country' && selectedCountry.length === 0) ||
            (Step === 'State' && selectedState.length === 0)
              ? 'ghost'
              : 'default'
          }
          onClick={onClickHandler}
          className='w-full rounded-b-none'
        >
          {
            {
              Country: (
                <div className='font-semibold flex items-center justify-center '>
                  {selectedCountry ? (
                    <>
                      {' '}
                      Continue with{' '}
                      <span className='font-black flex items-center justify-center gap-2 ml-2'>
                        {' '}
                        {selectedCountry} <ChevronRight />
                      </span>{' '}
                    </>
                  ) : (
                    'Select a Country'
                  )}
                </div>
              ),
              State: (
                <>
                  {selectedState ? (
                    <>
                      {' '}
                      Continue with{' '}
                      <span className='font-black flex items-center justify-center gap-2 ml-2'>
                        {' '}
                        {selectedState} <ChevronRight />
                      </span>{' '}
                    </>
                  ) : (
                    'Select a State'
                  )}
                </>
              ),
              Cities: (
                <>
                  {selectedCities.length > 0 ? (
                    <>
                      {' '}
                      Finish Selection with{' '}
                      {selectedCities.length === 1
                        ? '1 City'
                        : selectedCities.length + ' Cities'}
                    </>
                  ) : (
                    <>
                      {' '}
                      Use all Cities in{' '}
                      <span className='font-black flex items-center justify-center gap-2 '>
                        {' '}
                        {selectedState}
                      </span>{' '}
                    </>
                  )}
                </>
              ),
            }[Step]
          }
        </Button>
        <Progress
          value={Step === 'Country' ? 33 : Step === 'State' ? 66 : 100}
          className='rounded-t-none '
        />
      </div>
    </div>
  );
};
