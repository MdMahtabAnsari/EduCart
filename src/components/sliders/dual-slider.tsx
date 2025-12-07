import { Slider } from "@/components/ui/slider"

interface DualSliderProps {
    max: number;
    step?: number;
    values: [number, number];
    onChange: (values: [number, number]) => void;
    disabled: boolean;
}

export function DualSlider({ max, step = 1, values, onChange, disabled }: DualSliderProps) {
    {
        const handleChange = (newValues: number[]) => {
            onChange([newValues[0], newValues[1]]);
        };
        return (
            <div className="w-full px-2">
                <Slider
                    value={values}
                    onValueChange={handleChange}
                    max={max}
                    step={step}
                    disabled={disabled}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Min: {values[0]}</span>
                    <span>Max: {values[1]}</span>
                </div>
            </div>
        );
    }
}