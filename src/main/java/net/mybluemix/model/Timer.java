package net.mybluemix.model;

public class Timer {
    public static final String MILLISECOND = "ms";
    public static final String SECOND = "s";
    public static final String NANOSECOND = "ns";
     
    private long t0, time;
    private String timeUnit;
     
    public Timer() {
        this(MILLISECOND);
    }
     
    public Timer(String timeUnit) {
        setTimeUnit(timeUnit);
    }
     
    public String getTimeUnit() {
        return timeUnit;
    }
     
    public final void setTimeUnit(String timeUnit) {
        this.timeUnit = timeUnit;
    }
     
    public void start() {
        t0 = System.nanoTime();
    }
     
    public void stop() {
        time = System.nanoTime() - t0;
    }
     
    public double getTime() {
        if(timeUnit.equals(NANOSECOND)) return System.nanoTime() - t0;
        if(timeUnit.equals(SECOND)) return (System.nanoTime() - t0) / 1000000000.0;
        if(timeUnit.equals(MILLISECOND)) return (System.nanoTime() - t0) / 1000000.0;
        return time;
    }
}
