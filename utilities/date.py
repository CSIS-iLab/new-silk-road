

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

    def __str__(self):
        return 'fuzzydate({self.year}, {self.month}, {self.day})'.format(self=self)
