from datetime import date

# Liberated from cpython Lib/datetime.py
MONTH_DAYS = [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]


# Liberated from cpython Lib/datetime.py
def is_leap(year):
    "year -> 1 if leap year, else 0."
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)


class fuzzydate:
    def __new__(cls, year=None, month=None, day=None, raise_errors=False):
        '''Create an object with year, month and day properties.
        You may pass raise_errors=False and fuzzydate set invalid month or day values to None
        '''
        self = object.__new__(cls)
        self._year = year
        if month and (month <= 1 or month > 12):
            if raise_errors:
                raise ValueError('Month value must be in range 1-12')
            else:
                month = None
        self._month = month
        if day:
            if day <= 1 or day > 31:
                if raise_errors:
                    raise ValueError('Day value must be in range 1-31')
                else:
                    day = None
            if year and month:
                max_days = MONTH_DAYS[month]
                if is_leap(year) and month == 2:
                    max_days = MONTH_DAYS[month] + 1
                if day > max_days:
                    if raise_errors:
                        raise ValueError('Day is out of range for month')
                    else:
                        day = None
        self._day = day

        return self

    def __eq__(self, other):
        if (self._year == other._year) and (self._month == other._month) and (self._day == other._day):
            return True
        return False

    @property
    def year(self):
        return self._year

    @property
    def month(self):
        return self._month

    @property
    def day(self):
        return self._day

    def fillin(self, arg):
        '''
        Create a date object by filling in missing values from another date object
        '''
        if not isinstance(arg, date):
            raise TypeError('filldate a date object to fill in missing values')
        return date(self.year or arg.year, self.month or arg.month, self.day or arg.day)

    def __repr__(self):
        return 'fuzzydate({self.year}, {self.month}, {self.day})'.format(self=self)
