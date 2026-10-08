<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case SocietyAdmin = 'society_admin';
    case Resident = 'resident';
    case Guard = 'guard';
}
