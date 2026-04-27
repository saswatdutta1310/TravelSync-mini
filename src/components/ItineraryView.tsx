'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ItineraryData {
  trip: {
    destination: string;
    duration: number;
    budget: string;
    days: {
      day: number;
      theme: string;
      activities: {
        time: string;
        title: string;
        description: string;
        tips: string;
      }[];
    }[];
  };
}

interface ItineraryViewProps {
  itinerary: ItineraryData | null;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
  onRetry: () => void;
}

export function ItineraryView({ itinerary, isLoading, error, onReset, onRetry }: ItineraryViewProps) {
  const [activeDay, setActiveDay] = useState(1);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-fade-in text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-bold">Oops! Something went wrong</h3>
        <p className="text-muted-foreground max-w-md">{error}</p>
        <div className="flex gap-4 mt-4">
          <Button variant="outline" onClick={onReset}>Plan Another Trip</Button>
          <Button onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse p-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="h-8 bg-primary/20 rounded w-64"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-4 justify-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-24 bg-secondary rounded-full"></div>
          ))}
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-20 h-6 bg-muted rounded shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-24 bg-card rounded-xl border border-border/50"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!itinerary || !itinerary.trip) {
    return null;
  }

  const { trip } = itinerary;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-primary to-[#6c63ff] bg-clip-text text-transparent">
          Your Trip to {trip.destination}
        </h2>
        <p className="text-muted-foreground text-lg flex items-center justify-center gap-4">
          <span>{trip.duration} Days</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
          <span className="capitalize">{trip.budget} Budget</span>
        </p>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 justify-center max-w-4xl mx-auto scrollbar-hide">
        {trip.days.map((dayObj) => (
          <Button
            key={dayObj.day}
            variant={activeDay === dayObj.day ? 'default' : 'outline'}
            onClick={() => setActiveDay(dayObj.day)}
            className="rounded-full shrink-0"
          >
            Day {dayObj.day}
          </Button>
        ))}
      </div>

      {/* Timeline View */}
      <div className="max-w-3xl mx-auto space-y-8">
        {trip.days.filter(d => d.day === activeDay).map((dayObj) => (
          <div key={dayObj.day} className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground">Day {dayObj.day}: {dayObj.theme}</h3>
            </div>
            
            <div className="relative border-l-2 border-primary/20 ml-4 md:ml-8 space-y-8 pb-4">
              {dayObj.activities.map((activity, idx) => (
                <div key={idx} className="relative pl-8 md:pl-12">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
                  
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors shadow-sm dark:bg-card/80">
                    <CardHeader className="pb-3 flex flex-row items-start gap-4 space-y-0">
                      <div className="flex items-center gap-1.5 text-primary font-bold whitespace-nowrap bg-primary/10 px-3 py-1 rounded-md text-sm mt-0.5 shrink-0">
                        <Clock className="w-4 h-4" />
                        {activity.time}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{activity.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm leading-relaxed">{activity.description}</p>
                      
                      {activity.tips && (
                        <div className="flex items-start gap-2 text-sm bg-secondary/50 dark:bg-secondary/20 p-3 rounded-lg border border-border/50 text-foreground/80">
                          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span className="italic">{activity.tips}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8 border-t border-border/50">
        <Button onClick={onReset} size="lg" className="rounded-full shadow-lg">
          Plan Another Trip
        </Button>
      </div>
    </div>
  );
}
