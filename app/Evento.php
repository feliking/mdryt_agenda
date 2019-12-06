<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evento extends Model
{
    use SoftDeletes;
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function lugares(){
        $this->hasMany(Lugar::class);
    }

    public function delegados(){
        $this->hasMany(Delegado::class);
    }

    public function sectores(){
        $this->hasMany(Sector::class);
    }

    public function instituciones(){
        $this->hasMany(Sector::class);
    }
}
