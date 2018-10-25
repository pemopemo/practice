<?php

class Counter
{

	/**
	 * カウンターの値
	 * @var int
	 */
	private $value;

	/**
	 * デフォルトコンストラクタ<br>
	 * 0から始めて1ずつ増える
	 *
	 */
	public function __construct()
	{
		$this->value = 0;
	}

	/**
	 * 現在の値を単位数だけカウンターを増やす<br>
	 * デフォルトでは1増える
	 *
	 */
	public function push()
	{
		$this->value++;
	}

	/**
	 * カウンターをリセットする<br>
	 * リセットは、基本的に現在の値を0に戻して単位数を1にする
	 *
	 */
	public function reset()
	{
		$this->value = 0;
	}

	/**
	 * 現在のカウンターの値を取得
	 * @return int
	 */
	public function displayValue()
	{
		return $this->value;
	}
}
