/** Enables basic storage and retrieval of dates and times. */
export class Date {
    private _year: number
    private _monthIndex: number
    private _date: number
    private _hours: number
    private _minutes: number
    private _seconds: number
    private _ms: number

    /**
     * Creates a new Date.
     * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99 is used, then year is assumed to be 1900 + year.
     * @param monthIndex The month as a number between 0 and 11 (January to December).
     * @param date The date as a number between 1 and 31.
     * @param hours Must be supplied if minutes is supplied. A number from 0 to 23 (midnight to 11pm) that specifies the hour.
     * @param minutes Must be supplied if seconds is supplied. A number from 0 to 59 that specifies the minutes.
     * @param seconds Must be supplied if milliseconds is supplied. A number from 0 to 59 that specifies the seconds.
     * @param ms A number from 0 to 999 that specifies the milliseconds.
     */
    constructor(
        year: number,
        monthIndex: number,
        date?: number,
        hours?: number,
        minutes?: number,
        seconds?: number,
        ms?: number
    ) {
        this._year = year
        this._monthIndex = monthIndex
        this._date = date || 1
        this._hours = hours || 0
        this._minutes = minutes || 0
        this._seconds = seconds || 0
        this._ms = ms || 0
    }

    /** Gets the year, using local time. */
    getFullYear(): number {
        return this._year
    }
    /** Gets the month, using local time. */
    getMonth(): number {
        return this._monthIndex
    }
    /** Gets the day-of-the-month, using local time. */
    getDate(): number {
        return this._date
    }
    /** Gets the hours in a date, using local time. */
    getHours(): number {
        return this._hours
    }
    /** Gets the minutes of a Date object, using local time. */
    getMinutes(): number {
        return this._minutes
    }
    /** Gets the seconds of a Date object, using local time. */
    getSeconds(): number {
        return this._seconds
    }
    /** Gets the milliseconds of a Date, using local time. */
    getMilliseconds(): number {
        return this._ms
    }

    /**
     * Sets the milliseconds value in the Date object using local time.
     * @param ms A numeric value equal to the millisecond value.
     */
    setMilliseconds(ms: number): void {
        this._ms = ms
    }
    /**
     * Sets the seconds value in the Date object using local time.
     * @param sec A numeric value equal to the seconds value.
     * @param ms A numeric value equal to the milliseconds value.
     */
    setSeconds(sec: number, ms?: number) {
        this._seconds = sec
        if (!isNaN(ms)) this._ms = ms
    }
    /**
     * Sets the minutes value in the Date object using local time.
     * @param min A numeric value equal to the minutes value.
     * @param sec A numeric value equal to the seconds value.
     * @param ms A numeric value equal to the milliseconds value.
     */
    setMinutes(min: number, sec?: number, ms?: number) {
        this._minutes = min
        if (!isNaN(sec)) {
            this.setSeconds(sec, ms)
        }
    }
    /**
     * Sets the hour value in the Date object using local time.
     * @param hours A numeric value equal to the hours value.
     * @param min A numeric value equal to the minutes value.
     * @param sec A numeric value equal to the seconds value.
     * @param ms A numeric value equal to the milliseconds value.
     */
    setHours(hours: number, min?: number, sec?: number, ms?: number) {
        this._hours = hours
        if (!isNaN(min)) this.setMinutes(min, sec, ms)
    }
    /**
     * Sets the numeric day-of-the-month value of the Date object using local time.
     * @param date A numeric value equal to the day of the month.
     */
    setDate(date: number) {
        this._date = date
    }
    /**
     * Sets the month value in the Date object using local time.
     * @param month A numeric value equal to the month. The value for January is 0, and other month values follow consecutively.
     * @param date A numeric value representing the day of the month. If this value is not supplied, the value from a call to the getDate method is used.
     */
    setMonth(month: number, date?: number) {
        this._monthIndex = month
        if (!isNaN(date)) this.setDate(date)
    }
    /**
     * Sets the year of the Date object using local time.
     * @param year A numeric value for the year.
     * @param month A zero-based numeric value for the month (0 for January, 11 for December). Must be specified if numDate is specified.
     * @param date A numeric value equal for the day of the month.
     */
    setFullYear(year: number, month?: number, date?: number) {
        this._year = year
        if (!isNaN(month)) this.setMonth(month, date)
    }
}
