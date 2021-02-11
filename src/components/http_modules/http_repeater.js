import React from 'react';
import { Button, Typography, Row, Col, Input, Select, Spin, Result, Empty, Divider, Descriptions } from 'antd';
import { useQuery } from 'react-query';
import PersistedState from 'use-persisted-state';
import QueueAnim from 'rc-queue-anim';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default (props) => {
	const http_url = PersistedState('http_url_repeater');

	const [ values, setValues ] = http_url({
		url: 'httpbin.org/get',
		protocol: 'http://',
		type: 'GET'
	});
	const handleChange = (name) => (event) => {
		setValues({ ...values, [name]: event.target.value });
	};
	const handleChangeSelect = (name) => (event) => {
		setValues({ ...values, [name]: event });
	};

	const postData = async () => {
		const res = await fetch(`${values.protocol}${values.url}`, {
			method: values.type, // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			crossDomain: true,
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			redirect: 'follow', // manual, *follow, error
			referrer: values.protocol + values.url,
			/*
			headers: {
					'Content-Type': 'application/json'
					'Content-Type': 'application/x-www-form-urlencoded',
			},
			*/
			referrerPolicy: 'origin-when-cross-origin' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			//body: JSON.stringify(data) // body data type must match "Content-Type" header
		});
		return res;
	};
	const { isLoading, isError, data, error, refetch, isFetching, clear } = useQuery('', postData);
	console.log(data);

	if (isLoading) {
		return (
			<div style={{ textAlign: 'center', marginTop: 25 }}>
				<Spin tip='Loading...' />
			</div>
		);
	}
	if (isError) {
		return (
			<div>
				<Empty
					style={{ marginTop: 25 }}
					image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
					imageStyle={{
						height: 60
					}}
					description={<span>Error getting the data please contact us.</span>}
				>
					<pre style={{ color: 'gray', marginBottom: 15 }}>{error.message}</pre>
					<Button danger>
						<a href='https://github.com/LasCC/Hack-Tools/issues' rel='noreferrer noopener' target='_blank'>
							Report the bug
						</a>
					</Button>
					<Button
						type='link'
						style={{ marginLeft: 15 }}
						onClick={(localStorage.removeItem('http_url_repeater'), refetch())}
					>
						Change your request
					</Button>
				</Empty>
			</div>
		);
	}

	return (
		<QueueAnim delay={300} duration={1500}>
			<Title variant='Title level={3}' style={{ fontWeight: 'bold', margin: 15 }}>
				HTTP Repeater
			</Title>
			<Paragraph style={{ marginLeft: 15 }}>
				A reverse shell is a shell session established on a connection that is initiated from a remote machine,
				not from the local host.
			</Paragraph>
			<Divider dashed />
			<Row gutter={[ 16, 16 ]} style={{ padding: 15 }}>
				<Col>
					<Select
						defaultValue='GET'
						style={{ width: '100%' }}
						value={values.type}
						onChange={handleChangeSelect('type')}
					>
						<Option value={'GET'}>GET</Option>
						<Option value={'POST'}>POST</Option>
						<Option value={'HEAD'}>HEAD</Option>
						<Option value={'PUT'}>PUT</Option>
						<Option value={'DELETE'}>DELETE</Option>
						<Option value={'OPTIONS'}>OPTIONS</Option>
						<Option value={'PATCH'}>PATCH</Option>
					</Select>
				</Col>
				<Col>
					<Select
						defaultValue='http://'
						style={{ width: '100%' }}
						value={values.protocol}
						onChange={handleChangeSelect('protocol')}
					>
						<Option value={'http://'}>HTTP</Option>
						<Option value={'https://'}>HTTPS</Option>
					</Select>
				</Col>
				<Col span={9}>
					<Input
						style={{ borderColor: '#434343' }}
						onChange={handleChange('url')}
						onSubmit={() => refetch()}
						value={values.url}
						placeholder='http://127.0.0.1:8080/home/?a=1 OR example.com'
					/>
				</Col>
				<Col>
					<Button type='primary' onClick={() => refetch()}>
						Send
					</Button>
				</Col>
				<Col>
					<Button type='link' danger onClick={() => clear()}>
						Reset request
					</Button>
				</Col>
			</Row>
			<div>
				{isFetching ? (
					<div style={{ textAlign: 'center', marginTop: 25 }}>
						<Spin tip='Loading...' />
					</div>
				) : null}
			</div>
			{data != null ? (
				<div style={{ padding: 15 }}>
					<Descriptions title='Request info' style={{ marginBottom: 15 }}>
						<Descriptions.Item label='Status code'>{data.status}</Descriptions.Item>
						<Descriptions.Item label='Redirected'>{data.redirected}</Descriptions.Item>
						<Descriptions.Item label='Type'>{data.type}</Descriptions.Item>
						<Descriptions.Item label='URL'>
							<a href={data.url} target='_blank'>
								{data.url}
							</a>
						</Descriptions.Item>
					</Descriptions>
					<Row gutter={[ 16, 16 ]}>
						<Col span={12}>
							<TextArea autoSize={{ minRows: 5 }} value={''} rows={4} />
						</Col>
						<Col span={12}>
							<TextArea autoSize={{ minRows: 5 }} value={JSON.stringify(data, undefined, 2)} />
						</Col>
					</Row>
				</div>
			) : (
				<Result
					status='error'
					title='Something went wrong'
					subTitle='Please check and modify the following information before resubmitting.'
				>
					<div className='desc'>
						<Paragraph>
							<Text
								strong
								style={{
									fontSize: 16
								}}
							>
								The content you submitted has the following error:
							</Text>
						</Paragraph>
						<Paragraph>
							<CloseCircleOutlined className='site-result-demo-error-icon' /> The value that you submitted{' '}
							<b>does not exist</b>.
						</Paragraph>
						<Paragraph>
							<CloseCircleOutlined className='site-result-demo-error-icon' /> The{' '}
							<b>API is in maintenance</b>, please try again.
						</Paragraph>
					</div>
				</Result>
			)}
		</QueueAnim>
	);
};