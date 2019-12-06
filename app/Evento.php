<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evento extends Model
{
    use SoftDeletes;
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function lugar(){
        return $this->belongsTo(Lugar::class);
    }

    public function delegado(){
        return $this->belongsTo(Delegado::class);
    }

    public function sector(){
        return $this->belongsTo(Sector::class);
    }

    public function institucion(){
        return $this->belongsTo(Institucion::class);
    }
}
