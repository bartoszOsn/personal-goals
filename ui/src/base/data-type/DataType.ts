import type { DataTypePresenter } from '@/base/data-type/DataTypePresenter.ts';
import type { DataTypeEditor } from '@/base/data-type/DataTypeEditor.ts';

export interface DataType<TType> {
	Presenter: DataTypePresenter<TType>;
	Editor: DataTypeEditor<TType>;
}