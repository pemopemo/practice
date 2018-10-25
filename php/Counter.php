<?php

class Counter {

    private $value;   // カウンターの値
    private $step;    // カウントアップする単位
    
    /**
     * デフォルトコンストラクタ<br>
     * 0から始めて1ずつ増える
     * 
     */
    public function __construct(){
        $this->value = 0;
        $this->step  = 1;
    }

    /**
     * 現在の値を単位数だけカウンターを増やす<br>
     * デフォルトでは1増える
     *
     */
    public function push(){
        $this->value += $this->step;
    }
    
    /**
     * カウンターをリセットする<br>
     * リセットは、基本的に現在の値を0に戻して単位数を1にする
     *
     */
    public function reset(){
        $this->value = 0;
        $this->step  = 1;
    }

	/**
	 * 現在のカウンターの値を取得
	 * @return int
	 */
    public function displayValue(){
        return $this->value;
    }
}
