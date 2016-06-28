from datetime import date

class fuzzydate:
    def __new__(cls, year=None, month=None, day=None):
        self = object.__new__(cls)
        self._year = year
        self._month = month
        self._day = day

        return self

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

    def __str__(self):
        return 'fuzzydate({self.year}, {self.month}, {self.day})'.format(self=self)