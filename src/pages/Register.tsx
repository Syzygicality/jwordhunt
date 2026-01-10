"use client"

import * as React from "react"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { Button } from "@/components/ui/button";

interface QuestionOption{
    value: string;
    label: string;
}

interface Question {
    id: number;
    question: string;
    placeholder: string;
    type: "single-select" | "multi-select" | "text";
    field: string;
    options?: QuestionOption[];
}

function Register() {
    const [step, setStep] = React.useState(1);
    const [name, setName] = React.useState("");
    const [age, setAge] = React.useState("");
    const [country, setCountry] = React.useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const [questionAnswers, setQuestionAnswers] = React.useState<
        Record<number, string | string[]>
    >({});

    // Questions state
    const [questions, setQuestions] = React.useState<Question[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = React.useState(false);
    const [questionsError, setQuestionsError] = React.useState<string | null>(
        null
    );

    // Helper function to format labels
    const formatLabel = (value: string): string => {
        // Handle special cases
        if (value === "non-binary") return "Non-binary";
        if (value === "prefer not to say") return "Prefer Not To Say";
        
        // TherapyStyle values are already formatted, return as-is
        const therapyStyles = ["Cognitive Behavioral", "Humanistic", "Psychodynamic", "Problem Solving"];
        if (therapyStyles.includes(value)) return value;
        
        // Capitalize first letter of each word
        return value
            .split(/[\s-]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    const fetchQuestions = async () => {
        setIsLoadingQuestions(true);
        setQuestionsError(null);

        try {
            //TODO: Change URL for backend deployment
            const baseUrl = "http://localhost:8000";
            
            // Fetch all enum endpoints in parallel
            const [personalityRes, therapyStyleRes, toneRes, supportNeededRes, genderRes] = await Promise.all([
                fetch(`${baseUrl}/choices/personality`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }),
                fetch(`${baseUrl}/choices/therapy-style`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }),
                fetch(`${baseUrl}/choices/tone`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }),
                fetch(`${baseUrl}/choices/support-needed`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }),
                fetch(`${baseUrl}/choices/gender`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }),
            ]);

            // Check if all requests succeeded
            const responses = [personalityRes, therapyStyleRes, toneRes, supportNeededRes, genderRes];
            const failedResponse = responses.find(res => !res.ok);
            if (failedResponse) {
                throw new Error(`Failed to fetch choices: ${failedResponse.statusText}`);
            }

            // Parse all responses
            const [personalityValues, therapyStyleValues, toneValues, supportNeededValues, genderValues] = await Promise.all([
                personalityRes.json(),
                therapyStyleRes.json(),
                toneRes.json(),
                supportNeededRes.json(),
                genderRes.json(),
            ]);

            // Build question structure
            const builtQuestions: Question[] = [
                {
                    id: 1,
                    question: "What personality traits would you like in your therapist?",
                    placeholder: "Select one or more",
                    type: "multi-select",
                    field: "personality",
                    options: personalityValues.map((value: string) => ({
                        value,
                        label: formatLabel(value),
                    })),
                },
                {
                    id: 2,
                    question: "What therapy style do you prefer?",
                    placeholder: "Select a therapy style",
                    type: "single-select",
                    field: "therapy_style",
                    options: therapyStyleValues.map((value: string) => ({
                        value,
                        label: formatLabel(value),
                    })),
                },
                {
                    id: 3,
                    question: "What tone would you like?",
                    placeholder: "Select one or more",
                    type: "multi-select",
                    field: "tone",
                    options: toneValues.map((value: string) => ({
                        value,
                        label: formatLabel(value),
                    })),
                },
                {
                    id: 4,
                    question: "What support do you need?",
                    placeholder: "Select your primary need",
                    type: "single-select",
                    field: "support_needed",
                    options: supportNeededValues.map((value: string) => ({
                        value,
                        label: formatLabel(value),
                    })),
                },
                {
                    id: 5,
                    question: "What is your gender?",
                    placeholder: "Select your gender",
                    type: "single-select",
                    field: "gender",
                    options: genderValues.map((value: string) => ({
                        value,
                        label: formatLabel(value),
                    })),
                },
            ];

            setQuestions(builtQuestions);
        } catch (error) {
            console.error("Error fetching questions:", error);
            setQuestionsError(
                error instanceof Error
                    ? error.message
                    : "Failed to load questions"
            );
            setQuestions([]);
        } finally {
            setIsLoadingQuestions(false);
        }
    };

    React.useEffect(() => {
        if (step === 3) {
            fetchQuestions();
        }
    }, [step]);

    const handleContinue = () => {
        if (step === 1 && name.trim() !== "") {
            setStep(2);
        } else if (step === 2 && age.trim() !== "" && country.trim() !== "") {
            setStep(3);
        } else if (step === 3) {
            setStep(4);
        }
    };


    const handleQuestionContinue = () => {
        const currentAnswer = questionAnswers[currentQuestionIndex];

        if (
            currentAnswer &&
            ((typeof currentAnswer === "string" &&
                currentAnswer.trim() !== "") ||
                (Array.isArray(currentAnswer) && currentAnswer.length > 0))
        ) {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                // All questions answered - handle completion
                console.log({ name, age, country, answers: questionAnswers });
                // TODO: Send answers to backend template
            }
        }
    };

    const handleQuestionAnswer = (value: string | string[]) => {
        setQuestionAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: value,
        }));
    };

    const handleOptionSelect = (optionValue: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        const currentAnswer = questionAnswers[currentQuestionIndex];

        if (currentQuestion.type === "multi-select") {
            const currentArray = Array.isArray(currentAnswer)
                ? currentAnswer
                : [];
            const newAnswer = currentArray.includes(optionValue)
                ? currentArray.filter((v) => v !== optionValue)
                : [...currentArray, optionValue];
            handleQuestionAnswer(newAnswer);
        } else {
            handleQuestionAnswer(optionValue);
        }
    };


    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = questionAnswers[currentQuestionIndex];

    return (
        <div className='relative isolate flex items-center px-6 lg:px-8 h-screen'>
            <FieldSet className='flex items-center mx-auto max-w-2xl max-h-max'>
                {step === 1 ? (
                    <>
                        <FieldLegend className='text-center font-display'>
                            <h2 className='text-4xl'>What's your name?</h2>
                        </FieldLegend>
                        <FieldDescription className='text-center'>
                            I'd love to get to know you better
                        </FieldDescription>
                        <FieldGroup className="py-16 flex items-center">
                            <Field className=''>
                                <FieldLabel className="text-md" htmlFor='name'>Enter your name</FieldLabel>
                                <Input
                                    id='name'
                                    autoComplete='off'
                                    placeholder='Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && name.trim()) {
                                            handleContinue();
                                        }
                                    }}
                                />
                            </Field>
                        </FieldGroup>
                        <Button
                            size="lg"
                            className="text-lg"
                            onClick={handleContinue}
                            disabled={!name.trim()}
                        >
                            Continue
                        </Button>
                    </>
                ) : step === 2 ? (
                    <>
                        <FieldLegend className='text-center font-display'>
                            <h2 className='text-4xl'>Tell us more about you</h2>
                        </FieldLegend>
                        <FieldDescription className='text-center'>
                            We need a couple more details
                        </FieldDescription>
                        <FieldGroup className="py-16 flex flex-col gap-4">
                            <Field>
                                <FieldLabel className="text-md" htmlFor='age'>Enter your age</FieldLabel>
                                <Input
                                    id='age'
                                    type='number'
                                    autoComplete='off'
                                    placeholder='Age'
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel className="text-md" htmlFor='country'>Where are you from?</FieldLabel>
                                <CountryDropdown
                                    placeholder="Select country"
                                    defaultValue="Canada"
                                    onChange={(country) => {setCountry(country.alpha3);}}
                                />
                                    {/* <Input
                                    id='country'
                                    autoComplete='off'
                                    placeholder='Country'
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                /> */}
                            </Field>
                        </FieldGroup>
                        <Button
                            size="lg"
                            className="text-lg"
                            onClick={handleContinue}
                            disabled={!age.trim() || !country.trim()}
                        >
                            Continue
                        </Button>
                    </>
                ) : step === 3 ? (
                    <>
                        <FieldLegend className='text-center font-display'>
                            <h2 className='text-4xl'>Your Personalized Experience</h2>
                        </FieldLegend>
                        <FieldDescription className='text-center py-8'>
                            <div className="space-y-4 text-left">
                                <p className="text-lg">
                                    Your experience will be fully customized to ensure I meet your needs.
                                </p>
                            </div>
                        </FieldDescription>
                        <Button
                            size="lg"
                            className="text-lg mt-8"
                            onClick={handleContinue}
                        >
                            Customize your experience
                        </Button>
                    </>
                ) : (
                    <>
                        {isLoadingQuestions ? (
                            <div className="text-center py-16">
                                <p className="text-lg">Loading questions...</p>
                            </div>
                        ) : questionsError ? (
                            <div className="text-center py-16">
                                <p className="text-lg text-destructive mb-4">{questionsError}</p>
                                <Button onClick={fetchQuestions}>Retry</Button>
                            </div>
                        ) : questions.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-lg">No questions available</p>
                            </div>
                        ) : currentQuestion ? (
                            <>
                                {/* Progress Bar */}
                                <div className="w-full mb-8">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Question {currentQuestionIndex + 1} of {questions.length}
                                        </span>
                                    </div>
                                </div>

                                <FieldLegend className='text-center font-display'>
                                    <h2 className='text-4xl'>{currentQuestion.question}</h2>
                                </FieldLegend>
                                <FieldDescription className='text-center'>
                                    Your answers help us understand you better
                                </FieldDescription>
                                
                                <FieldGroup className="py-16 flex flex-col gap-4">
                                    {currentQuestion.type === "text" ? (
                                        <Field className='w-full'>
                                            <FieldLabel className="text-md" htmlFor='answer'>Your answer</FieldLabel>
                                            <Input
                                                id='answer'
                                                autoComplete='off'
                                                placeholder={currentQuestion.placeholder}
                                                value={typeof currentAnswer === 'string' ? currentAnswer : ""}
                                                onChange={(e) => handleQuestionAnswer(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && typeof currentAnswer === 'string' && currentAnswer.trim()) {
                                                        handleQuestionContinue();
                                                    }
                                                }}
                                            />
                                        </Field>
                                    ) : currentQuestion.options ? (
                                        <div className="flex flex-col gap-2 w-full">
                                            {currentQuestion.options.map((option) => {
                                                const isSelected = currentQuestion.type === "multi-select"
                                                    ? Array.isArray(currentAnswer) && currentAnswer.includes(option.value)
                                                    : currentAnswer === option.value;
                                                
                                                return (
                                                    <Button
                                                        key={option.value}
                                                        variant={isSelected ? "default" : "outline"}
                                                        className="w-full justify-start text-left"
                                                        onClick={() => handleOptionSelect(option.value)}
                                                    >
                                                        {option.label}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    ) : null}
                                </FieldGroup>
                                
                                <div className="flex gap-4 justify-center">
                                    {currentQuestionIndex > 0 && (
                                        <Button 
                                            variant="outline"
                                            className="text-lg"
                                            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                                        >
                                            Back
                                        </Button>
                                    )}
                                    <Button 
                                        className="text-lg"
                                        onClick={handleQuestionContinue}
                                        disabled={
                                            !currentAnswer || 
                                            (typeof currentAnswer === 'string' && !currentAnswer.trim()) ||
                                            (Array.isArray(currentAnswer) && currentAnswer.length === 0)
                                        }
                                    >
                                        {currentQuestionIndex < questions.length - 1 ? "Continue" : "Finish"}
                                    </Button>
                                </div>
                            </>
                        ) : null}
                    </>
                )}
            </FieldSet>
        </div>
    );
};

export default Register;