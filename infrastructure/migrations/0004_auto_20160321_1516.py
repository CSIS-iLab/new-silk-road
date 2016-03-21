# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-03-21 19:16
from __future__ import unicode_literals

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('infrastructure', '0003_auto_20160318_1314'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='projectfunding',
            options={'verbose_name_plural': 'project funders'},
        ),
        migrations.AlterField(
            model_name='project',
            name='sources',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.URLField(max_length=500), blank=True, default=list, help_text='Enter URLs separated by commas.', null=True, size=None, verbose_name='Sources URLs'),
        ),
        migrations.AlterField(
            model_name='projectfunding',
            name='currency',
            field=models.CharField(blank=True, choices=[('SBD', 'Solomon Islands Dollar'), ('GTQ', 'Quetzal'), ('MVR', 'Rufiyaa'), ('GHS', 'Ghana Cedi'), ('SHP', 'Saint Helena Pound'), ('MDL', 'Moldovan Leu'), ('KPW', 'North Korean Won'), ('TRY', 'Turkish Lira'), ('HNL', 'Lempira'), ('DJF', 'Djibouti Franc'), ('BSD', 'Bahamian Dollar'), ('BWP', 'Pula'), ('YER', 'Yemeni Rial'), ('LRD', 'Liberian Dollar'), ('AZN', 'Azerbaijanian Manat'), ('BDT', 'Taka'), ('USD', 'US Dollar'), ('ILS', 'New Israeli Sheqel'), ('ALL', 'Lek'), ('MOP', 'Pataca'), ('SGD', 'Singapore Dollar'), ('LBP', 'Lebanese Pound'), ('TOP', 'Pa’anga'), ('GNF', 'Guinea Franc'), ('VND', 'Dong'), ('TJS', 'Somoni'), ('FJD', 'Fiji Dollar'), ('CHF', 'Swiss Franc'), ('MYR', 'Malaysian Ringgit'), ('BBD', 'Barbados Dollar'), ('HTG', 'Gourde'), ('AWG', 'Aruban Florin'), ('SYP', 'Syrian Pound'), ('QAR', 'Qatari Rial'), ('TMT', 'Turkmenistan New Manat'), ('CLF', 'Unidad de Fomento'), ('WST', 'Tala'), ('ISK', 'Iceland Krona'), ('RWF', 'Rwanda Franc'), ('RON', 'Romanian Leu'), ('CHW', 'WIR Franc'), ('INR', 'Indian Rupee'), ('CNY', 'Yuan Renminbi'), ('HUF', 'Forint'), ('STD', 'Dobra'), ('GBP', 'Pound Sterling'), ('NZD', 'New Zealand Dollar'), ('BGN', 'Bulgarian Lev'), ('AED', 'UAE Dirham'), ('NIO', 'Cordoba Oro'), ('VUV', 'Vatu'), ('TZS', 'Tanzanian Shilling'), ('VEF', 'Bolívar'), ('ARS', 'Argentine Peso'), ('SDG', 'Sudanese Pound'), ('JPY', 'Yen'), ('BTN', 'Ngultrum'), ('KYD', 'Cayman Islands Dollar'), ('ZAR', 'Rand'), ('GEL', 'Lari'), ('COP', 'Colombian Peso'), ('TTD', 'Trinidad and Tobago Dollar'), ('CRC', 'Costa Rican Colon'), ('ETB', 'Ethiopian Birr'), ('DOP', 'Dominican Peso'), ('MXN', 'Mexican Peso'), ('AOA', 'Kwanza'), ('PEN', 'Sol'), ('UYU', 'Peso Uruguayo'), ('KZT', 'Tenge'), ('CHE', 'WIR Euro'), ('SZL', 'Lilangeni'), ('LAK', 'Kip'), ('NGN', 'Naira'), ('SSP', 'South Sudanese Pound'), ('SRD', 'Surinam Dollar'), ('BND', 'Brunei Dollar'), ('KGS', 'Som'), ('IDR', 'Rupiah'), ('BIF', 'Burundi Franc'), ('BRL', 'Brazilian Real'), ('BMD', 'Bermudian Dollar'), ('CUC', 'Peso Convertible'), ('DZD', 'Algerian Dinar'), ('CVE', 'Cabo Verde Escudo'), ('CZK', 'Czech Koruna'), ('HKD', 'Hong Kong Dollar'), ('IQD', 'Iraqi Dinar'), ('MUR', 'Mauritius Rupee'), ('MXV', 'Mexican Unidad de Inversion (UDI)'), ('PKR', 'Pakistan Rupee'), ('IRR', 'Iranian Rial'), ('AFN', 'Afghani'), ('XCD', 'East Caribbean Dollar'), ('RUB', 'Russian Ruble'), ('UZS', 'Uzbekistan Sum'), ('BZD', 'Belize Dollar'), ('ZWL', 'Zimbabwe Dollar'), ('CAD', 'Canadian Dollar'), ('GYD', 'Guyana Dollar'), ('XPF', 'CFP Franc'), ('KWD', 'Kuwaiti Dinar'), ('MWK', 'Malawi Kwacha'), ('NAD', 'Namibia Dollar'), ('BHD', 'Bahraini Dinar'), ('TND', 'Tunisian Dinar'), ('PGK', 'Kina'), ('USN', 'US Dollar (Next day)'), ('SOS', 'Somali Shilling'), ('JOD', 'Jordanian Dinar'), ('ZMW', 'Zambian Kwacha'), ('DKK', 'Danish Krone'), ('UYI', 'Uruguay Peso en Unidades Indexadas (URUIURUI)'), ('FKP', 'Falkland Islands Pound'), ('CLP', 'Chilean Peso'), ('LKR', 'Sri Lanka Rupee'), ('CDF', 'Congolese Franc'), ('AMD', 'Armenian Dram'), ('AUD', 'Australian Dollar'), ('MMK', 'Kyat'), ('BOB', 'Boliviano'), ('XAF', 'CFA Franc BEAC'), ('SEK', 'Swedish Krona'), ('PAB', 'Balboa'), ('SAR', 'Saudi Riyal'), ('CUP', 'Cuban Peso'), ('GMD', 'Dalasi'), ('MAD', 'Moroccan Dirham'), ('MKD', 'Denar'), ('JMD', 'Jamaican Dollar'), ('MZN', 'Mozambique Metical'), ('SLL', 'Leone'), ('BYR', 'Belarusian Ruble'), ('KHR', 'Riel'), ('EUR', 'Euro'), ('NPR', 'Nepalese Rupee'), ('BOV', 'Mvdol'), ('PYG', 'Guarani'), ('TWD', 'New Taiwan Dollar'), ('UAH', 'Hryvnia'), ('SVC', 'El Salvador Colon'), ('MRO', 'Ouguiya'), ('LYD', 'Libyan Dinar'), ('OMR', 'Rial Omani'), ('PLN', 'Zloty'), ('UGX', 'Uganda Shilling'), ('BAM', 'Convertible Mark'), ('ERN', 'Nakfa'), ('GIP', 'Gibraltar Pound'), ('HRK', 'Kuna'), ('LSL', 'Loti'), ('MNT', 'Tugrik'), ('KES', 'Kenyan Shilling'), ('COU', 'Unidad de Valor Real'), ('ANG', 'Netherlands Antillean Guilder'), ('MGA', 'Malagasy Ariary'), ('PHP', 'Philippine Peso'), ('XOF', 'CFA Franc BCEAO'), ('SCR', 'Seychelles Rupee'), ('EGP', 'Egyptian Pound'), ('THB', 'Baht'), ('KRW', 'Won'), ('RSD', 'Serbian Dinar'), ('KMF', 'Comoro Franc'), ('NOK', 'Norwegian Krone')], default='USD', max_length=3, null=True),
        ),
    ]
